"use client";
import { updateDefaultAccount } from "@/action/account";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import useFetch from "@/hook/useFetch";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { parse } from "path";
import { useEffect } from "react";
import { toast } from "sonner";

interface AccountCardProps {
  account: {
    id: string;
    name: string;
    type: string;
    balance: string;
    isDefault: boolean;
  };
}

const AccountCard = ({ account }: AccountCardProps) => {
  const { name, type, id, balance, isDefault } = account;
  const {
    error,
    loading: updateDefaultLoading,
    fetchData: updateDefaultFn,
    data: updatedAccount,
  } = useFetch(updateDefaultAccount);

  const handleChangeDefault = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isDefault) return toast.warning("you need atleast one default account");
    await updateDefaultFn(id);
  };

  useEffect(() => {
    if (updatedAccount?.success) {
      toast.success("Default account updated successfully!");
    }
    if (error) {
      toast.error(error.message || "Failed to update default account");
    }
  }, [updateDefaultLoading, updatedAccount, error]);
  return (
    <Card className="hover:shadow-md transition-shadow group relative ">
      <Link href={`/account/${id}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="capitalize text-sm font-medium">
            {name}
          </CardTitle>
          <Switch
            checked={isDefault}
            onClick={handleChangeDefault}
            disabled={updateDefaultLoading}
          />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">
            ${parseFloat(balance).toFixed(2)}
          </div>
          <p className="text-sm capitalize text-muted-foreground">
            {type.charAt(0) + type.slice(1).toLowerCase()} Account
          </p>
        </CardContent>
        <CardFooter className="flex justify-between items-center text-muted-foreground text-sm">
          <div className="flex items-center">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" /> Income
          </div>
          <div className="flex items-center">
            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" /> Expenses
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default AccountCard;
