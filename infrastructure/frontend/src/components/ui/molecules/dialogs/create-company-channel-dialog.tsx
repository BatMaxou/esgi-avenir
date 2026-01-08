"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/atoms/dialog";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FilledButton } from "../buttons/filled-button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../atoms/form";
import { Input } from "../../atoms/input";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useChannel } from "@/contexts/ChannelContext";
import { Button } from "../../atoms/button";

export default function CreateCompanyChannelDialog() {
  const t = useTranslations("components.dialogs.createCompanyChannel");
  const tButton = useTranslations("buttons");
  const { createCompanyChannel } = useChannel();
  const [isOpen, setIsOpen] = useState(false);

  const handleCancel = () => {
    setIsOpen(false);
  };

  const formSchema = z.object({
    title: z.string().min(1, {
      message: t("channelTitleError"),
    }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await createCompanyChannel(data);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="w-full">
        <div className="mb-4 px-2">
          <FilledButton
            icon="mdi:plus"
            iconPosition="start"
            onClick={() => setIsOpen(true)}
            label={t("title")}
            className="w-full"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className={form.formState.errors.title ? "mb-8" : ""}>
                  <FormLabel>{t("channelTitle")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("channelTitlePlaceholder")}
                      className="p-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-4 mt-4">
              <Button
                variant="ghost"
                onClick={handleCancel}
                className="cursor-pointer"
              >
                {tButton("cancel")}
              </Button>
              <FilledButton type="submit" label={t("createChannel")} />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
