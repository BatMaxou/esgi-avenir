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
import { Stock } from "../../../../../../../domain/entities/Stock";

export function UpdateStockForm({
  stock,
  onSuccess,
}: {
  stock: Stock;
  onSuccess?: () => void;
}) {
  const { updateStock } = useStocks();
  const t = useTranslations("components.forms.stock");
  const [loading, setLoading] = useState(false);

  const formSchema = z.object({
    name: z.string().min(1, {
      message: t("nameError"),
    }),
    baseQuantity: z.number().min(0, {
      message: t("baseQuantityError"),
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: stock.name || "",
      baseQuantity: stock.baseQuantity || 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!stock.id) return;

    setLoading(true);
    try {
      const response = await updateStock(
        stock.id,
        values.name,
        values.baseQuantity
      );

      if (response) {
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
        <FilledButton type="submit" label={t("update")} loading={loading} />
      </form>
    </Form>
  );
}
