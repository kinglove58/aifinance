"use server";

import { Account } from "@/lib/generated/prisma/client";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

type SerializedAccount = Omit<Account, "balance"> & {
  balance?: number; // Made optional for conditional inclusion
  amount?: number; // New field, conditionally included
  _count?: { transactions: number }; // Added to match the included _count from query
};

const serializeAccount = (account: Account): SerializedAccount => {
  const result: any = { ...account };

  if (account.balance) {
    result.balance = account.balance.toNumber();
  }

  // Assuming 'amount' is a new field; for now, set it to balance if it exists
  // Replace this logic with your actual 'amount' calculation (e.g., from a new model field)
  if (account.balance) {
    result.amount = account.balance.toNumber(); // Or compute differently, e.g., Math.abs(account.balance.toNumber())
  }

  return result as SerializedAccount;
};

export async function updateDefaultAccount(accountId: string) {
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
      throw new Error("User not found in database");
    }

    await db.account.updateMany({
      where: { userId: user.id, isDefault: true },
      data: { isDefault: false },
    });

    const account = await db.account.update({
      where: { id: accountId, userId: user.id },
      data: { isDefault: true },
    });

    revalidatePath("/dashboard");
    return { success: true, data: serializeAccount(account) };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "User not found in database",
    };
  }
}
