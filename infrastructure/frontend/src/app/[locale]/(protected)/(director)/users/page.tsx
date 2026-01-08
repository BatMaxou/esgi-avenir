"use client";

import { useNavigation } from "@/contexts/NavigationContext";
import { useUsers } from "@/contexts/UsersContext";
import { UsersDataTable } from "@/components/ui/organisms/UsersDataTable";
import { useEffect } from "react";

export default function UsersPage() {
  const { endNavigation } = useNavigation();
  const { users, getUsers, isUsersLoading } = useUsers();

  useEffect(() => {
    getUsers();
    endNavigation();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <UsersDataTable data={users} isLoading={isUsersLoading} />
    </div>
  );
}
