"use client";

import { useState, useEffect } from "react";
import { DataTable } from "../DataTable";
import { directorColumns } from "./director-columns";
import { advisorColumns } from "./advisor-columns";
import { User } from "../../../../../../../domain/entities/User";
import InputSearchLoader from "../../molecules/inputs/input-search-loader";
import { CreateUserDialog } from "../../molecules/dialogs/create-user-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { RoleEnum } from "../../../../../../../domain/enums/RoleEnum";
import { ColumnDef } from "@tanstack/table-core";
import { useTranslations } from "next-intl";

interface UsersDataTableProps {
  data: User[];
  isLoading?: boolean;
}

export function UsersDataTable({ data, isLoading }: UsersDataTableProps) {
  const [filteredData, setFilteredData] = useState<User[]>(data);
  const [displayedColumns, setDisplayedColumns] = useState<ColumnDef<User>[]>(
    []
  );
  const { user: authUser } = useAuth();
  const t = useTranslations("page.users");
  const tColumns = useTranslations("components.dataTable.users");

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  useEffect(() => {
    if (authUser && authUser.roles.includes(RoleEnum.DIRECTOR)) {
      setDisplayedColumns(directorColumns(tColumns));
    } else if (authUser && authUser.roles.includes(RoleEnum.ADVISOR)) {
      setDisplayedColumns(advisorColumns(tColumns));
    }
  }, [authUser, tColumns]);

  return (
    <div className="space-y-4">
      <div
        className={
          "w-full flex justify-between items-center" +
          (!authUser?.roles.includes(RoleEnum.DIRECTOR) ? " justify-end!" : "")
        }
      >
        {authUser?.roles.includes(RoleEnum.DIRECTOR) && <CreateUserDialog />}
        <div className="self-end">
          <InputSearchLoader
            label={t("search")}
            items={data}
            filterOnKey={["firstName", "lastName"]}
            setNewItems={(items) => setFilteredData(items as User[])}
          />
        </div>
      </div>
      <DataTable
        columns={displayedColumns}
        data={filteredData}
        pageSize={10}
        isLoading={isLoading}
      />
    </div>
  );
}
