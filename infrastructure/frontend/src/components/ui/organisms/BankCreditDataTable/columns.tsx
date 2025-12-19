"use client";

import { useTranslations } from "next-intl";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontalIcon, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/atoms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/atoms/dropdown-menu";
import { useRouter } from "@/i18n/navigation";
import { BankCreditRemainingBadge } from "../../molecules/badges/bank-credit-remaining-badge";
import { HydratedBankCredit } from "../../../../../../../domain/entities/BankCredit";
import { useBankCredits } from "@/contexts/BankCreditContext";

function CreditActionsCell({ credit }: { credit: HydratedBankCredit }) {
  const t = useTranslations("components.dataTable.bankCredits");
  const router = useRouter();
  const { setBankCredit } = useBankCredits();
  const id = credit.id;

  if (!id) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              setBankCredit(credit);
              router.push({
                pathname: "/credits/[id]",
                params: { id: id },
              });
            }}
          >
            <EyeIcon className="mr-2 h-4 w-4" />
            {t("consult")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export const columns = (
  t: (key: string) => string
): ColumnDef<HydratedBankCredit>[] => [
  {
    accessorKey: "owner.firstName",
    header: () => t("firstName"),
  },
  {
    accessorKey: "owner.lastName",
    header: () => t("lastName"),
  },
  {
    accessorKey: "owner.email",
    header: () => t("email"),
    cell: ({ row }) => {
      const email = row.original?.owner?.email;
      return email?.toString() || "-";
    },
  },
  {
    id: "account.iban",
    header: () => t("iban"),
    cell: ({ row }) => {
      const iban = row.original?.account?.iban || "-";
      return iban;
    },
  },
  {
    id: "amount",
    header: () => t("loanAmount"),
    cell: ({ row }) => {
      const amount = row.original.amount || "-";
      return amount;
    },
  },
  {
    id: "durationInMonths",
    header: () => t("loanDuration"),
    cell: ({ row }) => {
      const durationInMonths = row.original.durationInMonths || "-";
      return durationInMonths;
    },
  },
  {
    id: "remains",
    header: () => t("remaining"),
    cell: ({ row }) => {
      const remains = row.original.remains ?? 0;
      const status = row.original.status;
      return (
        <div className="flex items-center justify-end">
          <BankCreditRemainingBadge status={status} remains={remains} />
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CreditActionsCell credit={row.original} />,
  },
];
