"use client";

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
            Consulter
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export const columns: ColumnDef<HydratedBankCredit>[] = [
  {
    accessorKey: "owner.firstName",
    header: "Prénom",
  },
  {
    accessorKey: "owner.lastName",
    header: "Nom",
  },
  {
    accessorKey: "owner.email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.original?.owner?.email;
      return email?.toString() || "-";
    },
  },
  {
    id: "account.iban",
    header: "IBAN",
    cell: ({ row }) => {
      const iban = row.original?.account?.iban || "-";
      return iban;
    },
  },
  {
    id: "amount",
    header: "Montant du prêt",
    cell: ({ row }) => {
      const amount = row.original.amount || "-";
      return amount;
    },
  },
  {
    id: "durationInMonths",
    header: "Durée du prêt (mois)",
    cell: ({ row }) => {
      const durationInMonths = row.original.durationInMonths || "-";
      return durationInMonths;
    },
  },
  {
    id: "remains",
    header: "Reste à rembourser",
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
