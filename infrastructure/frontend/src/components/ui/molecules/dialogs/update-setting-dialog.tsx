"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/atoms/dialog";
import { Icon } from "@iconify/react";
import { SettingEnum } from "../../../../../../../domain/enums/SettingEnum";
import { UpdateSettingForm } from "../forms/update-setting-form";

interface UpdateSettingDialogProps {
  code: SettingEnum;
  title: string;
  currentValue: string | number | boolean | undefined;
}

export function UpdateSettingDialog({
  code,
  title,
  currentValue,
}: UpdateSettingDialogProps) {
  const t = useTranslations("components.dialogs.updateSetting");
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="hover:bg-gray-200 rounded-full p-2 cursor-pointer transition-all">
          <Icon icon="mdi:pencil" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("modify")} {title}
          </DialogTitle>
          <DialogDescription>
            {t("instruction")} <b>(format: 1.25)</b>
          </DialogDescription>
        </DialogHeader>
        <UpdateSettingForm
          code={code}
          title={title}
          currentValue={currentValue}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
