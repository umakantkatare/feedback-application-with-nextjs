"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Message } from "@/model/User";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { acceptMessageSchema } from "./../../../schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { toast } from "@/components/ui/toast";
import { User } from "next-auth";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Check, Copy, Loader2, RefreshCcw } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

const DashboardPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;

  const acceptMessage = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.add({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "failed to fetch message settings",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(true);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast.add({
            title: "Refreshed Messages",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;

        toast.add({
          title: "Error",
          description:
            axiosError.response?.data.message ?? "Failed to fetch messages",
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages],
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessage,
      });
      setValue("acceptMessages", !acceptMessage);
      toast.add({
        title: response.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.add({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "failed to accept message settings",
      });
    }
  };
  if (!session || !session.user) {
    return <div>please Login</div>;
  }

  const { username } = session.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;

  // another method
  // const baseUrl = `${window.location.origin}`;

  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = async () => {
    if (!profileUrl) return;
    try {
      await navigator.clipboard.writeText(profileUrl);

      setIsCopied(true);

      toast.add({
        title: "URL copied",
        description: "Your feedback link has been copied.",
      });

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      toast.add({
        title: "Copy failed",
        description: "Unable to copy the URL.",
      });
    }
  };
  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            User Dashboard
          </h1>

          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Manage your feedback link and messages.
          </p>
        </header>

        <section className="rounded-xl border bg-background p-4 shadow-sm sm:p-6">
          <div className="mb-4">
            <h2 className="text-base font-semibold sm:text-lg">
              Your Feedback Link
            </h2>

            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Share this link to receive anonymous feedback.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={profileUrl}
              readOnly
              aria-label="Your feedback profile URL"
              className="min-w-0 flex-1 bg-muted/50 text-xs sm:text-sm"
            />

            <Button
              type="button"
              onClick={copyToClipboard}
              className="w-full shrink-0 sm:w-auto"
            >
              {isCopied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </section>

        <section className="mt-4 rounded-xl border bg-background p-4 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-base font-semibold sm:text-lg">
                Message Settings
              </h2>

              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                {acceptMessage
                  ? "People can currently send you messages."
                  : "People cannot currently send you messages."}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <span
                className={`hidden text-sm font-medium sm:block ${
                  acceptMessage ? "text-green-600" : "text-muted-foreground"
                }`}
              >
                {acceptMessage ? "On" : "Off"}
              </span>

              <Switch
                checked={acceptMessage}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
                aria-label="Accept messages"
              />
            </div>
          </div>
        </section>

        <Separator className="my-6 sm:my-8" />

        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">Messages</h2>

              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                {messages.length}{" "}
                {messages.length === 1 ? "message" : "messages"}
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => fetchMessages(true)}
              disabled={isLoading}
              aria-label="Refresh messages"
              title="Refresh messages"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
            </Button>
          </div>

          {messages.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
              {messages.map((message) => (
                <MessageCard
                  key={message._id}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed bg-background px-4 py-12 text-center">
              <h3 className="text-sm font-semibold">No messages yet</h3>

              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                Share your feedback link to start receiving messages.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default DashboardPage;
