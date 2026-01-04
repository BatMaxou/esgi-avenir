"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useCallback, useContext } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/atoms/form";
import { SendMessageInput } from "@/components/ui/molecules/inputs/send-message-input";
import { useAuth } from "@/contexts/AuthContext";
import { MessageContext } from "@/contexts/MessageContext";
import { GetHydratedPrivateChannelResponseInterface } from "../../../../../../../application/services/api/resources/PrivateChannelResourceInterface";
import { useApiClient } from "@/contexts/ApiContext";
import { paths } from "../../../../../../../application/services/api/paths";
import { showErrorToast } from "@/lib/toast";

export function SendMessageForm({
  isAdvisorRequest = false,
  requestTitle = "",
  onMessageSent,
}: {
  isAdvisorRequest?: boolean;
  requestTitle?: string;
  onMessageSent?: (
    message: string,
    channel?: GetHydratedPrivateChannelResponseInterface
  ) => void;
}) {
  const { isLoading } = useAuth();
  const t = useTranslations("components.forms.sendMessage");
  const messageContext = useContext(MessageContext);
  const { apiClient } = useApiClient();

  const addMessage = messageContext?.addMessage;

  const formSchema = z.object({
    message: z.string().min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const onMessageSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      const message = values.message;
      addMessage(message);
      form.reset();
    },
    [addMessage, form]
  );

  const onRequestAdvisorSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      const message = values.message;

      try {
        const response =
          await apiClient.post<GetHydratedPrivateChannelResponseInterface>(
            paths.privateMessage.create,
            {
              title: requestTitle,
              content: message,
            }
          );

        if (response instanceof Error) {
          showErrorToast(response.message);
          return;
        }

        if (onMessageSent) {
          onMessageSent(message, response);
        }
        form.reset();
      } catch (error) {
        console.error("Error in onRequestAdvisorSubmit:", error);
        showErrorToast("Failed to send message");
      }
    },
    [apiClient, form, onMessageSent, requestTitle]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        form.handleSubmit(onMessageSubmit)();
      }
    },
    [form, onMessageSubmit]
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          isAdvisorRequest ? onRequestAdvisorSubmit : onMessageSubmit
        )}
        className="flex flex-col gap-4 w-full"
      >
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <SendMessageInput
                  {...field}
                  iconActive={field.value !== ""}
                  submitDisabled={field.value === ""}
                  placeholder={t("placeholder")}
                  isLoading={isLoading}
                  onKeyDown={handleKeyDown}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
