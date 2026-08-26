"use client";
import { toast } from "@/components/ui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useSession, signIn, signOut } from "next-auth/react";
import { signInSchema } from "@/schemas/signInSchema";
import { BackgroundBeams } from "@/components/ui/background-beams";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SigninPage() {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      const response = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });
      if (response?.error) {
        toast.add({
          title: "Login failed",
          description: response.error || "Invalid username/email or password.",
        });

        return;
      }

      toast.add({
        title: "Login successful",
        description: "Welcome back!",
      });
      if (response?.url) {
        router.replace("/dashboard");
      }
    } catch (error) {
      console.error("Sign in error:", error);

      toast.add({
        title: "Login failed",
        description: "Something went wrong. Please try again.",
      });
    }
  };
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <BackgroundBeams />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="inline-block text-2xl font-bold tracking-tight"
            >
              Your
              <span className="text-purple-500">Feedback-App</span>
            </Link>

            <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-neutral-400">
              Sign in to continue to your account.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/50 p-5 shadow-2xl backdrop-blur-xl sm:p-8">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="identifier">Username or Email</Label>

                <Input
                  id="identifier"
                  type="text"
                  placeholder="username or email"
                  autoComplete="username"
                  {...form.register("identifier")}
                  className="h-11 border-white/10 bg-white/5 text-white placeholder:text-neutral-500 focus-visible:ring-purple-500"
                />

                {form.formState.errors.identifier && (
                  <p className="text-xs text-red-400">
                    {form.formState.errors.identifier.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>

                  <Link
                    href="/forgot-password"
                    className="text-xs text-neutral-400 underline-offset-4 hover:text-white hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...form.register("password")}
                  className="h-11 border-white/10 bg-white/5 text-white placeholder:text-neutral-500 focus-visible:ring-purple-500"
                />

                {form.formState.errors.password && (
                  <p className="text-xs text-red-400">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="h-11 w-full bg-white font-semibold text-black hover:bg-neutral-200"
              >
                {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-neutral-400">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-white underline-offset-4 hover:underline"
              >
                Create account
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-xs leading-5 text-neutral-500">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-neutral-300 hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-neutral-300 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
