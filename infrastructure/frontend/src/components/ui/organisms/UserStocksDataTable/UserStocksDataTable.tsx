"use client";

import { DataTable } from "../DataTable/data-table";
import { columns, UserStockRow } from "./columns";
import { useTranslations } from "next-intl";

interface UserStocksDataTableProps {
  data: UserStockRow[];
  isLoading?: boolean;
}

export function UserStocksDataTable({
  data,
  isLoading,
}: UserStocksDataTableProps) {
  const t = useTranslations("components.cards.userStocks");
  console.log(data);
  return (
    <DataTable
      columns={columns(t)}
      data={data}
      pageSize={5}
      isLoading={isLoading}
    />
  );
}
