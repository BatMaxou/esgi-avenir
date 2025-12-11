"use client";

import { useState, useEffect } from "react";
import { DataTable } from "../DataTable";
import { columns } from "./columns";
import { User } from "../../../../../../../domain/entities/User";
import InputSearchLoader from "../../molecules/inputs/input-search-loader";

interface UsersDataTableProps {
  data: User[];
}

export function UsersDataTable({ data }: UsersDataTableProps) {
  const [filteredData, setFilteredData] = useState<User[]>(data);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  return (
    <div className="space-y-4">
      <div className="w-full flex justify-end">
        <InputSearchLoader
          label="Rechercher un utilisateur"
          items={data}
          filterOnKey={["firstName", "lastName"]}
          setNewItems={(items) => setFilteredData(items as User[])}
        />
      </div>
      <DataTable columns={columns} data={filteredData} pageSize={10} />
    </div>
  );
}
