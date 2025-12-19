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
import { HydratedStock } from "../../../../../../../domain/entities/Stock";
import { useStocks } from "@/contexts/StocksContext";
import { UpdateStockDialog } from "../../molecules/dialogs/update-stock-dialog";
import { Icon } from "@iconify/react";
import { useState } from "react";

function CreditActionsCell({ credit }: { credit: HydratedStock }) {
  const t = useTranslations("components.dataTable.stocks");
  const router = useRouter();
  const { setStock } = useStocks();
  const [openUpdate, setOpenUpdate] = useState(false);
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
              setStock(credit);
              router.push({
                pathname: "/credits/[id]",
                params: { id: id },
              });
            }}
          >
            <EyeIcon className="mr-2 h-4 w-4" />
            {t("consult")}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              setStock(credit);
              setOpenUpdate(true);
            }}
          >
            <Icon icon="mdi:pencil" className="mr-2 h-4 w-4" />
            {t("edit")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UpdateStockDialog
        stock={credit}
        setOpen={setOpenUpdate}
        open={openUpdate}
      />
    </>
  );
}

export const columns = (
  t: (key: string) => string
): ColumnDef<HydratedStock>[] => [
  {
    id: "name",
    header: () => t("name"),
    cell: ({ row }) => {
      const name = row.original?.name || "-";
      return name;
    },
  },
  {
    id: "baseQuantity",
    header: () => t("baseQuantity"),
    cell: ({ row }) => {
      const baseQuantity = row.original.baseQuantity ?? "-";
      return baseQuantity;
    },
  },
  {
    id: "basePrice",
    header: () => t("basePrice"),
    cell: ({ row }) => {
      const basePrice = row.original.basePrice ?? "-";
      return basePrice;
    },
  },
  {
    id: "balance",
    header: () => t("balance"),
    cell: ({ row }) => {
      const balance = row.original.balance ?? "-";
      return balance;
    },
  },
  {
    id: "remainingQuantity",
    header: () => t("remainingQuantity"),
    cell: ({ row }) => {
      const remainingQuantity = row.original.remainingQuantity ?? "-";
      return remainingQuantity;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CreditActionsCell credit={row.original} />,
  },
];
