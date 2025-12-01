"use client";

// Dependencies
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/atoms/select";
import { Input } from "@/components/ui/atoms/input";
import { FieldSeparator } from "@/components/ui/atoms/field";
import { useState } from "react";
import CheckMailDialog from "@/components/ui/molecules/dialogs/check-mail-dialog";
import { useApiClient } from "@/contexts/ApiContext";
import { showErrorToast } from "@/lib/toast";

const formSchema = z
  .object({
    firstName: z.string().min(2, {
      message: "Votre prénom est requis.",
    }),
    lastName: z.string().min(2, {
      message: "Votre nom est requis.",
    }),
    email: z.email({
      message: "L'email doit être une adresse email valide.",
    }),
    password: z.string().min(12, {
      message: "Le mot de passe doit comporter au moins 12 caractères.",
    }),
    passwordConfirm: z.string(),
    streetNumber: z.string().min(1, {
      message: "Le numéro de rue est requis.",
    }),
    street: z.string().min(2, {
      message: "Le nom de rue est requis.",
    }),
    postalCode: z.string().min(2, {
      message: "Le code postal est requis.",
    }),
    city: z.string().min(2, {
      message: "La ville est requise.",
    }),
    country: z.string().min(2, {
      message: "Le pays est requis.",
    }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Les mots de passes ne correspondent pas.",
    path: ["passwordConfirm"],
  });

interface RegisterFormProps {
  setFormType: (formType: "login" | "register") => void;
}

export function RegisterForm({ setFormType }: RegisterFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const apiClient = useApiClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirm: "",
      streetNumber: "",
      street: "",
      postalCode: "",
      city: "",
      country: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const response = await apiClient.apiClient.register(
        values.email,
        values.password,
        values.firstName,
        values.lastName
      );
      if ("success" in response && response.success) {
        setOpen(true);
        setLoading(false);
      } else {
        showErrorToast("Erreur durant l'inscription");
        setLoading(false);
      }
    } catch (error) {
      showErrorToast("Erreur durant l'inscription");
      console.error("Register failed:", error);
      setLoading(false);
    }
  }
  return (
    <>
      <CheckMailDialog
        open={open}
        setOpen={setOpen}
        setFormType={setFormType}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-2">
              <FormField
                control={form.control}
                name="firstName"
                render={() => (
                  <FormItem
                    className={form.formState.errors.lastName ? "mb-8" : ""}
                  >
                    <FormLabel>Genre</FormLabel>
                    <FormControl>
                      <Select>
                        <SelectTrigger className="w-full p-2">
                          <SelectValue className="p-2" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">M.</SelectItem>
                          <SelectItem value="dark">Mme.</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-5">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem
                    className={form.formState.errors.lastName ? "mb-8" : ""}
                  >
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input {...field} className="p-2" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-5">
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem
                    className={form.formState.errors.firstName ? "mb-12" : ""}
                  >
                    <FormLabel>Nom de famille</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FieldSeparator />
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
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem
                  className={
                    form.formState.errors.passwordConfirm ? "mb-12" : ""
                  }
                >
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem
                  className={form.formState.errors.password ? "mb-12" : ""}
                >
                  <FormLabel>Confirmez le mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FieldSeparator />
          {/* Section Adresse */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-3">
              <FormField
                control={form.control}
                name="streetNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>N° de rue</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-9">
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rue</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code postal</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-4">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pays</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FilledButton
            type="submit"
            loading={loading}
            label="Ouvrir un compte"
          />
        </form>
      </Form>
    </>
  );
}
