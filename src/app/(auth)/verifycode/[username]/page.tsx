"use client";
import { toast } from "@/components/ui/toast";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const VerifyCodePage = () => {
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      await toast.promise(
        axios.post<ApiResponse>("/api/verify-code", {
          username: decodeURIComponent(username),
          code: data.code,
        }),
        {
          loading: "Verifying code...",
          success: (response) => response.data.message,
          error: "Invalid verification code.",
        },
      );

      router.replace("/signin");
    } catch (error) {
      console.log("Error in verify-code page:", error);

      const axiosError = error as AxiosError<ApiResponse>;

      toast.add({
        title: "Verification failed",
        description:
          axiosError.response?.data?.message ?? "Invalid verification code.",
      });
    }
  };
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <BackgroundBeams />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              Your<span className="text-purple-500">Feedback-App</span>
            </Link>

            <h1 className="mt-7 text-3xl font-bold tracking-tight sm:text-4xl">
              Verify your account
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-neutral-400">
              We have sent a verification code to your account. Enter the
              6-digit code below to continue.
            </p>

            {username && (
              <p className="mt-2 text-sm text-neutral-300">
                Username:{" "}
                <span className="font-medium text-white">
                  {decodeURIComponent(username)}
                </span>
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/50 p-5 shadow-2xl backdrop-blur-xl sm:p-8">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
              <div className="space-y-3">
                <Label
                  htmlFor="verification-code"
                  className="block text-center text-sm text-neutral-300"
                >
                  Verification code
                </Label>

                <div className="flex justify-center">
                  <InputOTP
                    id="verification-code"
                    maxLength={6}
                    value={form.watch("code")}
                    onChange={(value) => {
                      form.setValue("code", value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                    onComplete={(value) => {
                      form.setValue("code", value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                  >
                    <InputOTPGroup className="gap-2 sm:gap-3">
                      <InputOTPSlot
                        index={0}
                        className="h-12 w-11 rounded-lg border-white/10 bg-white/5 text-lg sm:h-14 sm:w-12"
                      />

                      <InputOTPSlot
                        index={1}
                        className="h-12 w-11 rounded-lg border-white/10 bg-white/5 text-lg sm:h-14 sm:w-12"
                      />

                      <InputOTPSlot
                        index={2}
                        className="h-12 w-11 rounded-lg border-white/10 bg-white/5 text-lg sm:h-14 sm:w-12"
                      />

                      <InputOTPSlot
                        index={3}
                        className="h-12 w-11 rounded-lg border-white/10 bg-white/5 text-lg sm:h-14 sm:w-12"
                      />

                      <InputOTPSlot
                        index={4}
                        className="h-12 w-11 rounded-lg border-white/10 bg-white/5 text-lg sm:h-14 sm:w-12"
                      />

                      <InputOTPSlot
                        index={5}
                        className="h-12 w-11 rounded-lg border-white/10 bg-white/5 text-lg sm:h-14 sm:w-12"
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {form.formState.errors.code && (
                  <p className="text-center text-xs text-red-400">
                    {form.formState.errors.code.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="h-11 w-full bg-white font-semibold text-black hover:bg-neutral-200"
              >
                {form.formState.isSubmitting ? "Verifying..." : "Verify code"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-neutral-400">
              Already verified?{" "}
              <Link
                href="/signin"
                className="font-medium text-white underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-xs leading-5 text-neutral-500">
            Didn't receive the code? Check your spam folder or try requesting a
            new code.
          </p>
        </div>
      </div>
    </main>
  );
};

export default VerifyCodePage;
