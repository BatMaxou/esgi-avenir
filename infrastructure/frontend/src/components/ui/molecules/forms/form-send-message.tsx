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

export function SendMessageForm() {
  const { isLoading } = useAuth();
  const t = useTranslations("components.forms.sendMessage");
  const { addMessage } = useContext(MessageContext);

  const formSchema = z.object({
    message: z.string().min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      const message = values.message;
      addMessage(message);
      form.reset();
    },
    [addMessage, form]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        form.handleSubmit(onSubmit)();
      }
    },
    [form, onSubmit]
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
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
