import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { LayoutDashboard } from "lucide-react";

export const Header = () => {
  return (
    <div className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center px-6 sm:px-12 h-16 z-50">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Logo"
            width={50}
            height={50}
            className="h-12 w-auto object-contain"
          />
        </Link>
        <div>
          <SignedIn>
            <Link href={"/dashboard"}>
              <Button variant="outline">
                <LayoutDashboard size={18} />
                <span className="hidden md:inline">Dashboard,</span>
              </Button>
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline">Login</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>{" "}
        </div>
      </nav>
    </div>
  );
};
