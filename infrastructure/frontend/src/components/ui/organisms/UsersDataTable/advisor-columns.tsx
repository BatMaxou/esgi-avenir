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
import { useUsers } from "@/contexts/UsersContext";
import { User } from "../../../../../../../domain/entities/User";
import { useRouter } from "@/i18n/navigation";
import { RoleBadge } from "@/components/ui/molecules/badges/role-badge";

function UserActionsCell({ user }: { user: User }) {
  const t = useTranslations("components.dataTable.users");
  const router = useRouter();
  const id = user.id;

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
            onClick={() =>
              router.push({
                pathname: "/clients/[id]",
                params: { id: id },
              })
            }
          >
            <EyeIcon className="mr-2 h-4 w-4" />
            {t("consult")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export const advisorColumns = (
  t: (key: string) => string
): ColumnDef<User>[] => [
  {
    accessorKey: "firstName",
    header: () => t("firstName"),
  },
  {
    accessorKey: "lastName",
    header: () => t("lastName"),
  },
  {
    accessorKey: "email",
    header: () => t("email"),
    cell: ({ row }) => {
      const email = row.original.email.value;
      return email?.toString() || "-";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <UserActionsCell user={row.original} />,
  },
];
