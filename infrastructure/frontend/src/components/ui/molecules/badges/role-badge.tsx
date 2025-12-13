"use client";

import { Badge } from "@/components/ui/atoms/badge";
import { RoleEnum } from "../../../../../../../domain/enums/RoleEnum";

interface RoleBadgeProps {
  roles: RoleEnum[];
  className?: string;
}

export function RoleBadge({ roles, className }: RoleBadgeProps) {
  const rolePriority = {
    [RoleEnum.BANNED]: 0,
    [RoleEnum.DIRECTOR]: 1,
    [RoleEnum.ADVISOR]: 2,
    [RoleEnum.USER]: 3,
  };

  const sortedRoles = [...roles].sort(
    (a, b) => (rolePriority[a] ?? 999) - (rolePriority[b] ?? 999)
  );
  const displayRole = sortedRoles[0];

  const getRoleLabel = (role: RoleEnum): string => {
    switch (role) {
      case RoleEnum.BANNED:
        return "Banni";
      case RoleEnum.DIRECTOR:
        return "Directeur";
      case RoleEnum.ADVISOR:
        return "Conseiller";
      case RoleEnum.USER:
        return "Client";
      default:
        return "Inconnu";
    }
  };

  const getRoleStyles = (role: RoleEnum): string => {
    switch (role) {
      case RoleEnum.BANNED:
        return "bg-red-100 text-red-800 border-red-200";
      case RoleEnum.DIRECTOR:
        return "bg-purple-100 text-purple-800 border-purple-200";
      case RoleEnum.ADVISOR:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case RoleEnum.USER:
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (!displayRole) {
    return null;
  }

  return (
    <Badge
      variant="outline"
      className={
        getRoleStyles(displayRole) + (className ? ` ${className}` : "")
      }
    >
      {getRoleLabel(displayRole)}
    </Badge>
  );
}
