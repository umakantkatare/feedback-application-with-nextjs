"use client";
import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import Link from "next/link";
import { useTransition } from "react";
const Navbar = () => {
  const { data: session, status } = useSession();

  const [isPending, startTransition] = useTransition();

  const user: User = session?.user as User;

  const handleLogout = () => {
    startTransition(async () => {
      await signOut({
        callbackUrl: "/signin",
      });
    });
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-white sm:text-2xl"
        >
          Your
          <span className="text-purple-500">Feedback-App</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          {status === "loading" ? (
            <div className="h-9 w-24 animate-pulse rounded-md bg-white/10" />
          ) : session ? (
            <>
              <div className="hidden items-center gap-2 sm:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/20 text-sm font-semibold text-purple-400">
                  {user?.username?.charAt(0).toUpperCase() ||
                    user?.email?.charAt(0).toUpperCase() ||
                    "U"}
                </div>

                <div className="flex flex-col">
                  <span className="max-w-40 truncate text-sm font-medium text-white">
                    {user?.username || user?.email}
                  </span>

                  {user?.email && user?.username && (
                    <span className="max-w-40 truncate text-xs text-neutral-500">
                      {user.email}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/20 text-sm font-semibold text-purple-400 sm:hidden">
                {user?.username?.charAt(0).toUpperCase() ||
                  user?.email?.charAt(0).toUpperCase() ||
                  "U"}
              </div>

              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="hidden border-white/10 bg-transparent text-white hover:bg-white/10 sm:flex"
                >
                  Dashboard
                </Button>
              </Link>

              <Button
                onClick={handleLogout}
                disabled={isPending}
                variant="destructive"
                className="h-9"
              >
                {isPending ? "Logging out..." : "Logout"}
              </Button>
            </>
          ) : (
            <>
              <Link href="/signin">
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/10"
                >
                  Sign In
                </Button>
              </Link>

              <Link href="/signup">
                <Button className="bg-white text-black hover:bg-neutral-200">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
