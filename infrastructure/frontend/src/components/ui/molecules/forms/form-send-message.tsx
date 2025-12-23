"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useCallback, useContext } from "react";

import { FilledButton } from "@/components/ui/molecules/buttons/filled-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/atoms/form";
import { Input } from "@/components/ui/atoms/input";
import { useAuth } from "@/contexts/AuthContext";
import { MessageContext } from "@/contexts/MessageContext";

export function SendMessageForm() {
  const { isLoading } = useAuth();
  const t = useTranslations("components.forms.sendMessage");
  const { addMessage } = useContext(MessageContext);

  const formSchema = z.object({
    message: z.string().min(1, {
      message: t("messageError"),
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = useCallback((values: z.infer<typeof formSchema>) => {
    const message = values.message;
    addMessage(message);
    form.reset();
  }, [addMessage, form]);

  return <Form {...form}>
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
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FilledButton type="submit" loading={isLoading} label={t("submit")} />
    </form>
  </Form>
}
