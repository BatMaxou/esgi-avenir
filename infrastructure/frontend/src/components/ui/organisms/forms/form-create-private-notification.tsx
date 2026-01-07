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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/atoms/select";
import { FilledButton } from "../../molecules/buttons/filled-button";
import { useNotifications } from "@/contexts/NotificationsContext";
import { useUsers } from "@/contexts/UsersContext";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

type FormCreatePrivateNotificationProps = {
  onSuccess: () => void;
  onCancel: () => void;
};

export function FormCreatePrivateNotification({
  onSuccess,
  onCancel,
}: FormCreatePrivateNotificationProps) {
  const { users, isUsersLoading, getUsers } = useUsers();
  const [isUsersFetched, setIsUsersFetched] = useState<boolean>(false);
  const { user: myUser } = useAuth();
  const t = useTranslations("components.dialogs.notification.create");
  const { createPrivateNotification, isNotificationsLoading } =
    useNotifications();

  useEffect(() => {
    if (!isUsersLoading && !isUsersFetched) {
      getUsers();
      setIsUsersFetched(true);
    }
  }, [isUsersLoading, getUsers, isUsersFetched]);

  const formSchema = z.object({
    content: z.string().min(1, {
      message: t("contentError"),
    }),
    userId: z.string().min(1, {
      message: t("userError"),
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      userId: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const response = await createPrivateNotification(
      data.content,
      parseInt(data.userId)
    );

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
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("user")} </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("userPlaceholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isUsersLoading ? (
                    <SelectItem value="loading" disabled>
                      {t("loading")}
                    </SelectItem>
                  ) : users.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      {t("noUsers")}
                    </SelectItem>
                  ) : (
                    users
                      .filter((user) => myUser?.id !== user.id)
                      .map((user) => (
                        <SelectItem key={user.id} value={user.id!.toString()}>
                          {user.firstName} {user.lastName}
                        </SelectItem>
                      ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("content")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={
                    t("contentPlaceholder") ||
                    "Entrez le contenu de la notification"
                  }
                />
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
