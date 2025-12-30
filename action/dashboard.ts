"use server";

import { Account, Prisma } from "@/lib/generated/prisma/client";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

type CreateAccountInput = Pick<
  Prisma.AccountUncheckedCreateInput,
  "name" | "type" | "balance" | "isDefault"
>;

type SerializedAccount = Omit<Account, "balance"> & { 
  balance?: number;  // Made optional for conditional inclusion
  amount?: number;   // New field, conditionally included
  _count?: { transactions: number };  // Added to match the included _count from query
};

const serializeAccount = (account: Account): SerializedAccount => {
  const result: any = { ...account };
  
  if (account.balance) {
    result.balance = account.balance.toNumber();
  }
  
  // Assuming 'amount' is a new field; for now, set it to balance if it exists
  // Replace this logic with your actual 'amount' calculation (e.g., from a new model field)
  if (account.balance) {
    result.amount = account.balance.toNumber();  // Or compute differently, e.g., Math.abs(account.balance.toNumber())
  }
  
  return result as SerializedAccount;
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

export async function getUserAccounts(): Promise<SerializedAccount[]> {
  const session = await auth();
  const userId = session?.userId;
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) {
    throw new Error("User not found in database");
  }

  const accounts = await db.account.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          transactions: true,
        },
      },
    },
  });
  const serializedAccount = accounts.map(serializeAccount);
  return serializedAccount;
}
