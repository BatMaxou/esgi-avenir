"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { FilledButton } from "../buttons/filled-button";
import { useStocks } from "@/contexts/StocksContext";

export function CreateStockForm({ onSuccess }: { onSuccess?: () => void }) {
  const { createStock } = useStocks();
  const t = useTranslations("components.forms.stock");
  const [loading, setLoading] = useState(false);

  const formSchema = z.object({
    name: z.string().min(1, {
      message: t("nameError"),
    }),
    baseQuantity: z.number().min(0, {
      message: t("baseQuantityError"),
    }),
    basePrice: z.number().min(0, {
      message: t("basePriceError"),
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      baseQuantity: 0,
      basePrice: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const response = await createStock(
        values.name,
        values.baseQuantity,
        values.basePrice
      );

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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("name")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="baseQuantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("baseQuantity")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="basePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("basePrice")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FilledButton type="submit" label={t("create")} loading={loading} />
      </form>
    </Form>
  );
}
