"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/atoms/form";
import { Input } from "@/components/ui/atoms/input";
import { FilledButton } from "../../molecules/buttons/filled-button";
import { useNotifications } from "@/contexts/NotificationsContext";

type FormCreateGlobalNotificationProps = {
  onSuccess: () => void;
  onCancel: () => void;
};

export function FormCreateGlobalNotification({
  onSuccess,
  onCancel,
}: FormCreateGlobalNotificationProps) {
  const t = useTranslations("components.dialogs.notification.create");
  const { createGlobalNotification, isNotificationsLoading } =
    useNotifications();

  const formSchema = z.object({
    content: z.string().min(1, {
      message: t("contentError"),
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const response = await createGlobalNotification(data.content);

    if (response) {
      form.reset();
      onSuccess();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("content")}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t("contentPlaceholder")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <FilledButton
            type="button"
            onClick={onCancel}
            label={t("cancel")}
            className="bg-gray-500 hover:bg-gray-600"
          />
          <FilledButton
            type="submit"
            label={t("create")}
            loading={isNotificationsLoading}
            disabled={isNotificationsLoading}
          />
        </div>
      </form>
    </Form>
  );
}
