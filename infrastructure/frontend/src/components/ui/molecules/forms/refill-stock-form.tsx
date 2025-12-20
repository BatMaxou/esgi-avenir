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

export function RefillStockForm({
  stock,
  onSuccess,
}: {
  stock: Stock;
  onSuccess?: () => void;
}) {
  const { refillStock } = useStocks();
  const t = useTranslations("components.forms.stock");
  const [loading, setLoading] = useState(false);

  const formSchema = z.object({
    additionalQuantity: z.number().min(1, {
      message: t("additionalQuantityError"),
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      additionalQuantity: 1,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!stock.id) return;

    setLoading(true);
    try {
      const response = await refillStock(stock.id, values.additionalQuantity);

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
          name="additionalQuantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("additionalQuantity")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 1)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FilledButton type="submit" label={t("refill")} loading={loading} />
      </form>
    </Form>
  );
}
