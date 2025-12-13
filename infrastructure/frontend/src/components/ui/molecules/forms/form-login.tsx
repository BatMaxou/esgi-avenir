"use client";

import { useState } from "react";

// Dependencies
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
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
  const apiClient = useApiClient();
  const router = useRouter();
  const { me } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const response = await apiClient.apiClient.login(
        values.email,
        values.password
      );
      let errorMessage;
      if ("token" in response && response.token) {
        await me();
        router.push("/home");
        setLoading(false);
      } else {
        if (response instanceof ApiClientError) {
          errorMessage =
            String(response.message) === "Unauthorized"
              ? "Email ou mot de passe incorrect."
              : String(response.message) === "User account is not enabled yet."
              ? "Veuillez d'abord activer votre compte."
              : "Erreur de connexion";
          showErrorToast(errorMessage);
          setLoading(false);
        } else {
          showErrorToast("Erreur de connexion");
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
      setLoading(false);
    }
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
          <FilledButton type="submit" loading={loading} label="Se connecter" />
        </form>
      </Form>
    </>
  );
}
