"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import * as z from "zod";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { ApiResponse } from "@/types/ApiResponse";
import { messageSchema } from "@/schemas/messageSchema";

import { toast } from "@/components/ui/toast";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";

const Page = () => {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const messageContent = watch("content");

  const handleMessageClick = (message: string) => {
    setValue("content", message, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const sendMessages = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);

    try {
      const response = await axios.post<ApiResponse>("/api/send-messages", {
        ...data,
        username,
      });

      toast.add({
        title: response.data.message || "Message sent successfully",
      });

      reset();
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.add({
        title: "Error",
        description:
          axiosError.response?.data.message || "Failed to send message",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto my-8 max-w-4xl rounded bg-white p-6">
      <h1 className="mb-6 text-center text-4xl font-bold">
        Public Profile Link
      </h1>

      <form onSubmit={handleSubmit(sendMessages)} className="space-y-6">
        <FieldSet className="w-full">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="content">Feedback</FieldLabel>

              <Textarea
                id="content"
                placeholder="Your feedback helps us improve..."
                rows={4}
                disabled={isLoading}
                className="w-full"
                {...register("content")}
              />

              {errors.content ? (
                <p className="text-sm text-destructive">
                  {errors.content.message}
                </p>
              ) : (
                <FieldDescription>
                  Share your thoughts about our service.
                </FieldDescription>
              )}
            </Field>
          </FieldGroup>
        </FieldSet>

        <div className="flex justify-center">
          <Button type="submit" disabled={isLoading || !messageContent?.trim()}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Send It"
            )}
          </Button>
        </div>
      </form>

      <Separator className="my-6" />

      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>

        <Link href="/sign-up">
          <Button type="button">Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
};

export default Page;
