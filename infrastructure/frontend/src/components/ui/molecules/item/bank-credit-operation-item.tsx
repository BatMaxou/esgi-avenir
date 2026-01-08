"use client";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
} from "@/components/ui/atoms/item";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/atoms/avatar";
import { useTranslations } from "next-intl";
import { HydratedAccountWithOperations } from "@/contexts/AccountsContext";
import { MonthlyPayment } from "../../../../../../../domain/entities/MonthlyPayment";

type BankCreditOperationItemProps = {
  payment: MonthlyPayment;
  account?: HydratedAccountWithOperations | null;
};

export default function BankCreditOperationItem({
  payment,
}: BankCreditOperationItemProps) {
  const t = useTranslations("components.items.bankCreditOperation");
  return (
    <Item
      className="p-4 mb-4 border border-gray-100 bg-gray-50 rounded-lg shadow-md flex flex-row justify-between items-center"
      asChild
    >
      <li>
        <ItemMedia>
          <Avatar className="size-10 bg-red-700 justify-center items-center ">
            <AvatarImage
              src="/assets/images/bank-transfer-in-icon.svg"
              className="w-6 h-6"
            />
            <AvatarFallback>to bank</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <span className="font-semibold text-md">{t("creditRepayment")}</span>
        </ItemContent>
        <ItemActions>
          <span className="font-medium text-lg text-red-600">
            -{payment.amount.toFixed(2)} €
          </span>
        </ItemActions>
      </li>
    </Item>
  );
}
