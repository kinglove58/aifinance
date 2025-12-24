"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useState } from "react";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AccountSchema } from "@/app/lib/schema";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";

interface CreateAccountDrawerProps {
  children?: ReactNode;
}

const CreateAccountDrawer = ({ children }: CreateAccountDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(AccountSchema),
    defaultValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      isDefault: false,
    },
  });
  const onSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/dashboard/create-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Error creating account:", error);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create a new Account</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <form className="space-y-4" onSubmit={handleSubmit(onsubmit)}>
            <div className="space-y-2">
              <div>
                <label htmlFor="name" className="text-sm font-medium">
                  Account Name
                </label>
                <Input
                  {...register("name")}
                  placeholder="e.g John Doe"
                  id="name"
                  type="text"
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <label htmlFor="type" className="text-sm font-medium">
                  Account Type
                </label>
                <Select
                  onValueChange={(value: "CURRENT" | "SAVINGS") =>
                    setValue("type", value)
                  }
                  defaultValue={watch("type")}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="select an account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CURRENT">CURRENT</SelectItem>
                    <SelectItem value="SAVINGS">SAVINGS</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-600">{errors.type.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <label htmlFor="balance" className="text-sm font-medium">
                  Initial Balance
                </label>
                <Input
                  {...register("balance")}
                  placeholder="e.g 1000"
                  id="balance"
                  step="0.01"
                  type="number"
                />
                {errors.balance && (
                  <p className="text-sm text-red-600">
                    {errors.balance.message}
                  </p>
                )}
              </div>
            </div>{" "}
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <label htmlFor="isDefault" className="text-sm font-medium">
                  Set as Default Account
                </label>
                <p>This account will be selected as the default account.</p>
              </div>
              <Switch
                {...register("isDefault")}
                onCheckedChange={(checked) => setValue("isDefault", checked)}
                checked={watch("isDefault")}
                id="isDefault"
              />
            </div>
            <div className="flex gap-4 pt-4">
              <DrawerClose asChild>
                <Button type="button" className="flex-1" variant="outline">
                  Cancel
                </Button>
              </DrawerClose>
              <Button type="submit" className="flex-1">
                Create Account
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateAccountDrawer;
