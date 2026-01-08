"use client";

import { ReactNode } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleEnum } from "../../../../../../../domain/enums/RoleEnum";

type Props = {
  children: ReactNode;
};

export default function DirectorLayout({ children }: Props) {
  return (
    <ProtectedRoute requiredRoles={[RoleEnum.DIRECTOR]}>
      {children}
    </ProtectedRoute>
  );
}
