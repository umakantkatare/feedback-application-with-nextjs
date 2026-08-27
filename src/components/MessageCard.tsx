"use client";
import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import dayjs from "dayjs";
import { Message } from "@/model/User";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { toast } from "./ui/toast";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`,
      );
      toast.add({ title: response.data.message });
      onMessageDelete(message._id);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.add({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to delete message",
      });
    }
  };
  return (
    <Card className="border-border/50 shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="space-y-3">
        <div className="flex items-start gap-3">
          <CardTitle className="min-w-0 flex-1 break-words text-base font-medium leading-6 sm:text-lg">
            {message.content}
          </CardTitle>

          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  aria-label="Delete message"
                  className="h-8 w-8 shrink-0"
                />
              }
            >
              <X className="h-4 w-4" />
            </AlertDialogTrigger>

            <AlertDialogContent className="w-[calc(100%-2rem)] max-w-md rounded-xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>

                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this message.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
                <AlertDialogCancel className="mt-0 w-full sm:w-auto">
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  className="w-full sm:w-auto"
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <p className="text-xs text-muted-foreground sm:text-sm">
          {dayjs(message.createdAt).format("MMM D, YYYY h:mm A")}
        </p>
      </CardHeader>
    </Card>
  );
};

export default MessageCard;
