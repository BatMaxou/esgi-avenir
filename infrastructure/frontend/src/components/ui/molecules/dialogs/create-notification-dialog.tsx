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
import { Tooltip, TooltipContent, TooltipTrigger } from "../../atoms/tooltip";
import { FormCreateGlobalNotification } from "../../organisms/forms/form-create-global-notification";
import { FormCreatePrivateNotification } from "../../organisms/forms/form-create-private-notification";

type TabType = "global" | "private";

export function CreateNotificationDialog() {
  const t = useTranslations("components.dialogs.notification.create");
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("global");

  const handleSuccess = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="absolute right-6 bottom-8">
          <Tooltip>
            <TooltipTrigger>
              <div className="group w-12 h-12 text-3xl rounded-full bg-primary-red border-2 border-primary-red hover:bg-white hover:text-primary-red cursor-pointer font-bold text-white flex items-center justify-center">
                <Icon
                  icon="entypo:megaphone"
                  width="20"
                  height="20"
                  className="text-white group-hover:text-primary-red"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{t("notificate")}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("global")}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "global"
                ? "text-black border-b-2 border-black"
                : "text-gray-600 hover:text-black"
            }`}
          >
            {t("globalTab")}
          </button>
          <button
            onClick={() => setActiveTab("private")}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "private"
                ? "text-black border-b-2 border-black"
                : "text-gray-600 hover:text-black"
            }`}
          >
            {t("privateTab")}
          </button>
        </div>

        {activeTab === "global" ? (
          <FormCreateGlobalNotification
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        ) : (
          <FormCreatePrivateNotification
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
