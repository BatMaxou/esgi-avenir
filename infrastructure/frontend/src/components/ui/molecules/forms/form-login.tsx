"use client";

import { useState } from "react";

// Dependencies
import { useForm } from "react-hook-form";
import { useRouter } from "@/i18n/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Local imports
import { FilledButton } from "@/components/ui/molecules/buttons/filled-button";
import { showErrorToast } from "@/lib/toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/atoms/form";
import { Input } from "@/components/ui/atoms/input";
import { useApiClient } from "@/contexts/ApiContext";
import { useAuth } from "@/contexts/AuthContext";
import { ApiClientError } from "../../../../../../../application/services/api/ApiClientError";

const formSchema = z.object({
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: "L'email doit être une adresse valide.",
  }),
  password: z.string().min(1, {
    message: "Le mot de passe ne peut pas être vide.",
  }),
});

export function LoginForm() {
  const { login, isLoading } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await login(values.email, values.password);
  }
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 flex flex-col gap-5"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FilledButton
            type="submit"
            loading={isLoading}
            label="Se connecter"
          />
        </form>
      </Form>
    </>
  );
}
