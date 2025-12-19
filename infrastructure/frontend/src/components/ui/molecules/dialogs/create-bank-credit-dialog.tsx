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
import CreateBankCreditForm from "../forms/create-bank-credit-form";
import { Item, ItemActions, ItemContent } from "../../atoms/item";
import { Icon } from "@iconify/react";
import { useState } from "react";

interface CreateBankCreditDialogProps {
  accountId: number;
  ownerId: number;
}

export default function CreateBankCreditDialog({
  accountId,
  ownerId,
}: CreateBankCreditDialogProps) {
  const t = useTranslations("components.dialogs.createBankCredit");
  const [isOpen, setIsOpen] = useState(false);
  const handleSuccess = () => {
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="w-full">
        <Item
          className={
            "p-4 rounded-lg shadow transition-all bg-red-600 cursor-pointer hover:bg-red-700"
          }
          onClick={() => setIsOpen(true)}
        >
          <ItemContent className="flex flex-row justify-start">
            <Icon
              icon="ph:hand-coins-light"
              width="24"
              height="24"
              className="text-white"
            />
            <span className={"font-semibold text-md text-white"}>
              {t("grantCredit")}
            </span>
          </ItemContent>
          <ItemActions>
            <Icon icon="mdi:chevron-right" className={"w-5 h-5 text-white"} />
          </ItemActions>
        </Item>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer un crédit</DialogTitle>
          <DialogDescription>
            Créez un nouveau crédit bancaire pour ce client.
          </DialogDescription>
        </DialogHeader>
        <CreateBankCreditForm
          accountId={accountId}
          ownerId={ownerId}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
