"use client";

import { useState, useEffect } from "react";
import { DataTable } from "../DataTable";
import { columns } from "./columns";
import InputSearchLoader from "../../molecules/inputs/input-search-loader";
import { HydratedBankCredit } from "../../../../../../../domain/entities/BankCredit";
import { useTranslations } from "next-intl";

interface BankCreditDataTableProps {
  data: HydratedBankCredit[];
  isLoading?: boolean;
}

export function BankCreditDataTable({
  data,
  isLoading,
}: BankCreditDataTableProps) {
  const [filteredData, setFilteredData] = useState<HydratedBankCredit[]>(data);
  const t = useTranslations("page.credits");
  const tColumns = useTranslations("components.dataTable.bankCredits");

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  return (
    <div className="space-y-4">
      <div className="w-full flex justify-end items-center">
        <InputSearchLoader
          label={t("search")}
          items={data}
          filterOnKey={[
            "owner.firstName",
            "owner.lastName",
            "account.iban",
            "owner.email",
            "amount",
            "remains",
          ]}
          setNewItems={(items) =>
            setFilteredData(items as HydratedBankCredit[])
          }
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
