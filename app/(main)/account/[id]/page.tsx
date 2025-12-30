import { getAccountWithTransactions } from "@/action/account";
import NotFound from "@/app/not-found";
import React from "react";

interface PageProps {
  params: {
    id: string;
  };
}

interface AccountViewModel {
  id: string;
  name: string;
  type: string;
  balance?: number;
  _count?: {
    transactions: number;
  };
  transactions: any[];
}

const page = async ({ params }: PageProps) => {
  const accountData = await getAccountWithTransactions(params.id);

  if (!accountData || "error" in accountData) {
    return <NotFound />;
  }

  const { transactions, ...account } = accountData as AccountViewModel;
  const balance = account.balance ?? 0;
  const transactionCount = account._count?.transactions ?? 0;
  return (
    <div className="flex space-y-8 px-5 gap-4 items-end justify-between">
      <div>
        <h1 className="text-5xl sm:text-6xl gradient-title capitalize font-bold">
          {account.name}
        </h1>
        <p className="text-muted-foreground ">
          {account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account
        </p>
      </div>
      <div className="text-right pb-2">
        <div className="text-xl font-bold sm:text-2xl">
          {balance.toFixed(2)}
        </div>
        <p className="text-sm text-muted-foreground ">
          {transactionCount} Transactions
        </p>
      </div>
      {/* chart session */}
      {/* transaction table */}
    </div>
  );
};

export default page;
