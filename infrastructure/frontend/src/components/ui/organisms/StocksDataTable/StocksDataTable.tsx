"use client";

import { useState, useEffect } from "react";
import { DataTable } from "../DataTable";
import { columns } from "./columns";
import InputSearchLoader from "../../molecules/inputs/input-search-loader";

import { useTranslations } from "next-intl";
import { HydratedStock } from "../../../../../../../domain/entities/Stock";
import { CreateStockDialog } from "../../molecules/dialogs/create-stock-dialog";

interface StocksDataTableProps {
  data: HydratedStock[];
  isLoading?: boolean;
}

export function StocksDataTable({ data, isLoading }: StocksDataTableProps) {
  const [filteredData, setFilteredData] = useState<HydratedStock[]>(data);
  const t = useTranslations("page.stocks");
  const tColumns = useTranslations("components.dataTable.stocks");

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  return (
    <div className="space-y-4">
      <div className={"w-full flex items-center justify-between"}>
        <CreateStockDialog />
        <InputSearchLoader
          label={t("search")}
          items={data}
          filterOnKey={["name"]}
          setNewItems={(items) => setFilteredData(items as HydratedStock[])}
        />
      </div>
      <DataTable
        columns={columns(tColumns)}
        data={filteredData}
        pageSize={10}
        isLoading={isLoading}
      />
    </div>
  );
}
