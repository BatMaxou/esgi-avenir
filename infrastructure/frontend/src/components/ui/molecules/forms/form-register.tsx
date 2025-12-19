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
import { useAuth } from "@/contexts/AuthContext";
import { useTranslations } from "next-intl";

interface RegisterFormProps {
  setFormType: (formType: "login" | "register") => void;
}

export function RegisterForm({ setFormType }: RegisterFormProps) {
  const { register, isLoading } = useAuth();
  const t = useTranslations("components.forms.register");
  const [open, setOpen] = useState(false);

  const formSchema = z
    .object({
      firstName: z.string().min(2, {
        message: t("firstNameError"),
      }),
      lastName: z.string().min(2, {
        message: t("lastNameError"),
      }),
      email: z.email({
        message: t("emailError"),
      }),
      password: z.string().min(12, {
        message: t("passwordError"),
      }),
      passwordConfirm: z.string(),
      streetNumber: z.string().min(1, {
        message: t("streetNumberError"),
      }),
      street: z.string().min(2, {
        message: t("streetError"),
      }),
      postalCode: z.string().min(2, {
        message: t("postalCodeError"),
      }),
      city: z.string().min(2, {
        message: t("cityError"),
      }),
      country: z.string().min(2, {
        message: t("countryError"),
      }),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: t("passwordMismatch"),
      path: ["passwordConfirm"],
    });

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
    const response = await register(
      values.email,
      values.password,
      values.firstName,
      values.lastName
    );
    if (response) {
      setOpen(true);
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
                    <FormLabel>{t("gender")}</FormLabel>
                    <FormControl>
                      <Select>
                        <SelectTrigger className="w-full p-2">
                          <SelectValue className="p-2" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">{t("mr")}</SelectItem>
                          <SelectItem value="dark">{t("mrs")}</SelectItem>
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
                    <FormLabel>{t("firstName")}</FormLabel>
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
                    <FormLabel>{t("lastName")}</FormLabel>
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
                <FormLabel>{t("email")}</FormLabel>
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
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem
                  className={form.formState.errors.password ? "mb-12" : ""}
                >
                  <FormLabel>{t("passwordConfirm")}</FormLabel>
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
                    <FormLabel>{t("streetNumber")}</FormLabel>
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
                    <FormLabel>{t("street")}</FormLabel>
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
                    <FormLabel>{t("postalCode")}</FormLabel>
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
                    <FormLabel>{t("city")}</FormLabel>
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
                    <FormLabel>{t("country")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FilledButton type="submit" loading={isLoading} label={t("submit")} />
        </form>
      </Form>
    </>
  );
}
