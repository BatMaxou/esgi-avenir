"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/atoms/form";
import { Input } from "@/components/ui/atoms/input";
import { FilledButton } from "../buttons/filled-button";
import { SettingEnum } from "../../../../../../../domain/enums/SettingEnum";
import { useSettings } from "@/contexts/SettingsContext";

const formSchema = z.object({
  value: z
    .string()
    .regex(/^\d+\.?\d{0,2}$/, {
      message: "La valeur doit être un nombre avec maximum 2 décimales.",
    })
    .refine((val) => !isNaN(parseFloat(val)), {
      message: "La valeur doit être un nombre valide.",
    }),
});

interface UpdateSettingFormProps {
  code: SettingEnum;
  title: string;
  currentValue: string | number | boolean | undefined;
  onSuccess?: () => void;
}

export function UpdateSettingForm({
  code,
  title,
  currentValue,
  onSuccess,
}: UpdateSettingFormProps) {
  const { update, isSettingsLoading } = useSettings();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value:
        typeof currentValue === "number"
          ? currentValue.toFixed(2)
          : typeof currentValue === "string"
          ? currentValue
          : "0.00",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await update(code, parseFloat(values.value));
    onSuccess?.();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{title}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="0.00"
                  className="text-lg"
                  autoFocus
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (
                      inputValue === "" ||
                      /^\d*\.?\d{0,2}$/.test(inputValue)
                    ) {
                      field.onChange(e);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FilledButton
          type="submit"
          loading={isSettingsLoading}
          label="Enregistrer"
          className="w-full"
        />
      </form>
    </Form>
  );
}
