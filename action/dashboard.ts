"use server";

import { Account, Prisma } from "@/lib/generated/prisma/client";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

type CreateAccountInput = Pick<
  Prisma.AccountUncheckedCreateInput,
  "name" | "type" | "balance" | "isDefault"
>;

type SerializedAccount = Omit<Account, "balance"> & { balance: number };

const serializeAccount = (account: Account): SerializedAccount => {
  return {
    ...account,
    balance: account.balance.toNumber(),
  };
};

export async function createAccount(
  data: CreateAccountInput
): Promise<
  { success: true; data: SerializedAccount } | { success: false; error: string }
> {
  try {
    const session = await auth();
    const userId = session?.userId;
    if (!userId) {
      return { success: false, error: "User not authenticated" };
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) {
      return { success: false, error: "User not found in database" };
    }

    const balanceFloat = Number(data.balance);
    if (Number.isNaN(balanceFloat)) {
      return { success: false, error: "Invalid balance amount provided" };
    }

    const existingAccounts = await db.account.findMany({
      where: { userId: user.id },
    });
    const shouldBeDefault =
      existingAccounts.length === 0 ? true : Boolean(data.isDefault);

    if (shouldBeDefault) {
      await db.account.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const account = await db.account.create({
      data: {
        name: data.name,
        type: data.type,
        balance: balanceFloat,
        userId: user.id,
        isDefault: shouldBeDefault,
      },
    });

    const serializedAccount = serializeAccount(account);
    revalidatePath("/dashboard");
    return { success: true, data: serializedAccount };
  } catch (error) {
    let errorMsg = "An unknown error occurred while creating account";
    if (error instanceof Error) {
      errorMsg = error.message;
    }
    return { success: false, error: errorMsg };
  }
}
