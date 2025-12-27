"use client";

import { ColumnDef } from "@tanstack/react-table";

export type UserStockRow = {
  name: string;
  quantity: number;
  marketPrice: number;
  totalValue: number;
};

export const columns = (
  t: (key: string) => string
): ColumnDef<UserStockRow>[] => [
  {
    accessorKey: "name",
    header: t("stockName"),
    cell: ({ row }) => (
      <div className="font-medium text-gray-900">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "quantity",
    header: () => <div className="text-right">{t("quantity")}</div>,
    cell: ({ row }) => (
      <div className="text-right text-gray-700">{row.getValue("quantity")}</div>
    ),
  },
  {
    accessorKey: "marketPrice",
    header: () => <div className="text-right">{t("marketPrice")}</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("marketPrice"));
      return (
        <div className="text-right text-gray-700">{amount.toFixed(2)} €</div>
      );
    },
  },
  {
    id: "totalValue",
    header: () => <div className="text-right">{t("totalValue")}</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.original.totalValue.toString());
      return (
        <div className="text-right text-gray-700">{amount.toFixed(2)} €</div>
      );
    },
  },
];
