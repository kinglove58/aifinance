import Link from "next/link";
import { ArrowLeft, Compass, Home } from "lucide-react";

import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="relative isolate overflow-hidden min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-700/30 via-slate-900 to-purple-800/30" />
      <div className="absolute -left-32 top-24 h-64 w-64 rounded-full bg-blue-500/25 blur-3xl" />
      <div className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-purple-500/25 blur-3xl" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pb-16 pt-28">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-50">
          <Compass className="size-4" />
          You look a bit lost
        </div>

        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Page not found
          </h1>
          <p className="mx-auto max-w-2xl text-base text-slate-200 sm:text-lg">
            The page you’re looking for has either moved, been renamed, or never
            existed. Let’s get you back to building your financial flow.
          </p>
        </div>

        <div className="mt-10 flex w-full max-w-xl flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild variant="secondary" className="w-full sm:w-auto">
            <Link href="/">
              <Home className="size-4" />
              Go home
            </Link>
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/dashboard">
              <ArrowLeft className="size-4 rotate-180" />
              Back to dashboard
            </Link>
          </Button>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-300">
          <span className="inline-flex h-10 items-center rounded-full border border-white/15 px-4 backdrop-blur">
            Tip: double-check the URL or use the navigation above.
          </span>
          <span className="inline-flex h-10 items-center rounded-full border border-white/15 px-4 backdrop-blur">
            Need help? Reach out to support.
          </span>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
