"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import * as z from "zod";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useCompletion } from "@ai-sdk/react";

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

import { Card, CardContent, CardHeader } from "@/components/ui/card";

const specialChar = "||";

const parseStringMessages = (messageString: string): string[] => {
  return messageString
    .split(specialChar)
    .map((message) => message.trim())
    .filter(Boolean);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

const Page = () => {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const [isLoading, setIsLoading] = useState(false);

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: "/api/suggest-messages",
    initialCompletion: initialMessageString,
  });

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

  const fetchSuggestedMessages = async () => {
    await complete("");
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

  const suggestedMessages = parseStringMessages(completion);

  return (
    <div className="container mx-auto my-8 max-w-3xl px-4">
      <div className="rounded-xl border bg-background p-5 shadow-sm sm:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Send an Anonymous Message
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Send a message to{" "}
            <span className="font-medium text-foreground">@{username}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit(sendMessages)} className="space-y-5">
          <FieldSet className="w-full">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="content">Your Message</FieldLabel>

                <Textarea
                  id="content"
                  placeholder="Write your message here..."
                  rows={6}
                  disabled={isLoading}
                  className="min-h-32 resize-y"
                  {...register("content")}
                />

                {errors.content ? (
                  <p className="text-sm text-destructive">
                    {errors.content.message}
                  </p>
                ) : (
                  <FieldDescription>
                    Your message will be sent anonymously.
                  </FieldDescription>
                )}
              </Field>
            </FieldGroup>
          </FieldSet>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !messageContent?.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </Button>
        </form>

        <Separator className="my-8" />

        <div className="space-y-3">
          <div>
            <h2 className="text-sm font-semibold">Need inspiration?</h2>

            <p className="text-xs text-muted-foreground">
              Choose a message to quickly fill the textbox.
            </p>
          </div>

          <div className="my-8 space-y-4">
            <div className="space-y-2">
              <Button
                type="button"
                onClick={fetchSuggestedMessages}
                className="my-4"
                disabled={isSuggestLoading}
              >
                {isSuggestLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Suggest Messages"
                )}
              </Button>

              <p className="text-sm text-muted-foreground">
                Click on any message below to select it.
              </p>
            </div>

            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">Messages</h3>
              </CardHeader>

              <CardContent className="flex flex-col space-y-4">
                {error ? (
                  <p className="text-sm text-red-500">{error.message}</p>
                ) : suggestedMessages.length > 0 ? (
                  suggestedMessages.map((message, index) => (
                    <Button
                      key={`${message}-${index}`}
                      type="button"
                      variant="outline"
                      className="mb-2 whitespace-normal text-left"
                      onClick={() => handleMessageClick(message)}
                    >
                      {message}
                    </Button>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Click "Suggest Messages" to get some ideas.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="rounded-lg bg-muted/50 p-5 text-center">
          <h2 className="font-semibold">Want your own message board?</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Create an account and start receiving anonymous messages.
          </p>

          <Link href="/sign-up" className="mt-4 inline-block">
            <Button type="button">Create Your Account</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
