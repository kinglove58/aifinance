"use server";

import { Account, Prisma } from "@/lib/generated/prisma/client";
import { newPrisma } from "@/lib/prisma";
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

export async function CreateAccount(
  data: CreateAccountInput
): Promise<{ success: true; data: SerializedAccount }> {
  try {
    const session = await auth();
    const userId = session?.userId;
    if (!userId) throw new Error("User not authenticated");

    const user = await newPrisma.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) {
      throw new Error("User not found in database");
    }

    const balanceFloat = Number(data.balance);
    if (Number.isNaN(balanceFloat)) {
      throw new Error("invalid balance amount");
    }

    const existingAccounts = await newPrisma.account.findMany({
      where: { userId: user.id },
    });
    const shouldBeDefault =
      existingAccounts.length === 0 ? true : Boolean(data.isDefault);

    if (shouldBeDefault) {
      await newPrisma.account.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const account = await newPrisma.account.create({
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
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unknown error occurred while creating account");
  }
}
