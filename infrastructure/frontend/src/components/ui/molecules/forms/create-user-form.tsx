"use client";

import { useState } from "react";

// Dependencies
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Local imports
import { FilledButton } from "@/components/ui/molecules/buttons/filled-button";
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
import { useUsers } from "@/contexts/UsersContext";
import { RoleEnum } from "../../../../../../../domain/enums/RoleEnum";
import { CreateUserPayloadInterface } from "../../../../../../../application/services/api/resources/UserResourceInterface";
import { useTranslations } from "next-intl";

export function CreateUserForm({ onSuccess }: { onSuccess?: () => void }) {
  const { createUser } = useUsers();
  const t = useTranslations("components.forms.user");
  const [loading, setLoading] = useState(false);

  const formSchema = z.object({
    firstName: z.string().min(1, {
      message: t("firstNameError"),
    }),
    lastName: z.string().min(1, {
      message: t("lastNameError"),
    }),
    email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
      message: t("emailError"),
    }),
    password: z.string().min(8, {
      message: t("passwordError"),
    }),
    roles: z.array(z.enum(RoleEnum)).optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      roles: [RoleEnum.USER],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const payload: CreateUserPayloadInterface = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        roles: values.roles,
      };

      const response = await createUser(payload);

      if (response) {
        form.reset();
        if (onSuccess) {
          onSuccess();
        }
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 flex flex-col"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("firstName")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("lastName")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email")}</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("password")}</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="roles"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("role")}</FormLabel>
              <Select
                onValueChange={(value) => field.onChange([value as RoleEnum])}
                defaultValue={field.value?.[0]}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("rolePlaceholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={RoleEnum.USER}>
                    {t("roleClient")}
                  </SelectItem>
                  <SelectItem value={RoleEnum.ADVISOR}>
                    {t("roleAdvisor")}
                  </SelectItem>
                  <SelectItem value={RoleEnum.DIRECTOR}>
                    {t("roleDirector")}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FilledButton type="submit" loading={loading} label={t("create")} />
      </form>
    </Form>
  );
}
