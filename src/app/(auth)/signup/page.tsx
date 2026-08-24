"use client";

import React, { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "@/components/ui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@base-ui/react/input";

const SigninPage = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [submit, SetSubmit] = useState(false);

  const router = useRouter();

  const debouncedUsername = useDebounceCallback(setUsername, 400);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
  });

  useEffect(() => {
    const checkedUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");

        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`,
          );
          setUsernameMessage(response?.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username",
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkedUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    SetSubmit(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/sign-up`, data);

      toast.add({
        title: "Success",
        description: response.data.message,
      });

      router.replace(`/verify/${encodeURIComponent(data.username)}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      setUsernameMessage(
        axiosError.response?.data.message ?? "Error checking username",
      );
    } finally {
      SetSubmit(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <BackgroundBeams />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="inline-block text-2xl font-bold tracking-tight"
            >
              Your<span className="text-purple-500">Feedback-App</span>
            </Link>

            <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
              Create your account
            </h1>

            <p className="mt-2 text-sm text-neutral-400">
              Start your journey with us today.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/50 p-5 shadow-2xl backdrop-blur-xl sm:p-8">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>

                <Input
                  id="username"
                  type="text"
                  placeholder="umakant123"
                  autoComplete="username"
                  {...form.register("username", {
                    onChange: (event) => {
                      debouncedUsername(event.target.value);
                    },
                  })}
                  className="h-11 border-white/10 bg-white/5 text-white placeholder:text-neutral-500 focus-visible:ring-purple-500"
                />

                {form.formState.errors.username && (
                  <p className="text-xs text-red-400">
                    {form.formState.errors.username.message}
                  </p>
                )}

                {isCheckingUsername && username && (
                  <p className="text-xs text-neutral-400">
                    Checking username...
                  </p>
                )}

                {!isCheckingUsername && username && usernameMessage && (
                  <p
                    className={`text-xs ${
                      usernameMessage.toLowerCase().includes("available")
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {usernameMessage}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>

                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  {...form.register("email")}
                  className="h-11 border-white/10 bg-white/5 text-white placeholder:text-neutral-500 focus-visible:ring-purple-500"
                />

                {form.formState.errors.email && (
                  <p className="text-xs text-red-400">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>

                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...form.register("password")}
                  className="h-11 border-white/10 bg-white/5 text-white placeholder:text-neutral-500 focus-visible:ring-purple-500"
                />

                {form.formState.errors.password && (
                  <p className="text-xs text-red-400">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={submit || isCheckingUsername}
                className="h-11 w-full bg-white font-semibold text-black hover:bg-neutral-200"
              >
                {submit ? "Creating account..." : "Create account"}
              </Button>
            </form>

            {/* Login */}
            <div className="mt-6 text-center text-sm text-neutral-400">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-medium text-white underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-neutral-500">
            By creating an account, you agree to our{" "}
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
};

export default SigninPage;
