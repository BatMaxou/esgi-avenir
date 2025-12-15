"use client";

import { Badge } from "@/components/ui/atoms/badge";
import { BankCreditStatusEnum } from "../../../../../../../domain/enums/BankCreditStatusEnum";

interface BankCreditRemainingBadgeProps {
  status: BankCreditStatusEnum;
  remains: number | string;
  className?: string;
}

export function BankCreditRemainingBadge({
  status,
  remains,
  className,
}: BankCreditRemainingBadgeProps) {
  const getRemainingLabel = (
    status: BankCreditStatusEnum,
    remains: number | string
  ): string => {
    return status === BankCreditStatusEnum.COMPLETED &&
      (remains === 0 || remains === "0")
      ? "Remboursé"
      : `${remains}€`;
  };

  const getRemainingStyles = (
    status: BankCreditStatusEnum,
    remains: number | string
  ): string => {
    return status === BankCreditStatusEnum.COMPLETED && remains === 0
      ? "bg-green-100 text-green-800 border-green-200 text-md"
      : "bg-orange-100 text-orange-800 border-orange-200 text-md";
  };

  if (!status || remains === undefined) {
    return null;
  }

  return (
    <Badge
      variant="outline"
      className={
        getRemainingStyles(status, remains) + (className ? ` ${className}` : "")
      }
    >
      <b>{getRemainingLabel(status, remains)}</b>
    </Badge>
  );
}
