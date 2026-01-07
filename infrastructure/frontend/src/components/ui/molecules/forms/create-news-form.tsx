"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { useTranslations } from "next-intl";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/atoms/form";
import { Input } from "@/components/ui/atoms/input";
import { FilledButton } from "../buttons/filled-button";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";

type CreateNewsFormProps = {
  onSubmit: (data: { title: string; content: string }) => Promise<void>;
  onCancel?: () => void;
};

export function CreateNewsForm({ onSubmit, onCancel }: CreateNewsFormProps) {
  const t = useTranslations("components.forms.news");
  const [loading, setLoading] = useState(false);
  const blockNoteRef = useRef<HTMLDivElement>(null);
  const editor = useCreateBlockNote();

  const formSchema = z.object({
    title: z.string().min(1, {
      message: t("titleError"),
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const HTMLFromBlocks = await editor.blocksToFullHTML(editor.document);
      await onSubmit({ ...values, content: HTMLFromBlocks });
      form.reset();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 flex flex-col"
        onClickCapture={(e) => {
          const target = e.target as HTMLElement;
          const isButton =
            target.tagName === "BUTTON" || target.closest("button");
          const isInsideBlockNote = blockNoteRef.current?.contains(target);
          if (isButton && isInsideBlockNote) {
            e.preventDefault();
          }
        }}
      >
        <div className="flex flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{t("formTitle")}</h1>
          <div className="flex justify-end gap-2">
            {onCancel && (
              <FilledButton
                type="button"
                onClick={onCancel}
                label={t("cancel")}
                className="bg-gray-500 hover:bg-gray-600"
              />
            )}
            <FilledButton type="submit" label={t("submit")} loading={loading} />
          </div>
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t("titlePlaceholder")}
                  className="h-12 text-2xl! font-semibold!"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div
          ref={blockNoteRef}
          className="border rounded-md min-h-[300px] py-4"
        >
          <BlockNoteView editor={editor} />
        </div>
      </form>
    </Form>
  );
}
