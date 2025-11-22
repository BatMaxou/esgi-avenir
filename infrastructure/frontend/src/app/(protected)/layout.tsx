"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleEnum } from "../../../../../domain/enums/RoleEnum";
import Header from "@/components/partials/Header";
import { useAccounts } from "@/contexts/AccountsContext";
import { useAuth } from "@/contexts/AuthContext";
import { Banner } from "@/components/partials/Banner";

type Props = {
  children: ReactNode;
};

// Nommage des routes statiques
const pageTitles: Record<string, string> = {
  "/home": "Tableau de bord",
  "/accounts": "Mes comptes",
  "/transfers": "Virements",
  "/investments": "Mes investissements",
  "/profile": "Mon profil",
};

export default function ProtectedLayout({ children }: Props) {
  const pathname = usePathname();
  const { getAccounts } = useAccounts();
  const { isAuthenticated, isLoading } = useAuth();

  // Nommage des routes dynamiques
  let pageTitle = pageTitles[pathname];
  if (!pageTitle && pathname.startsWith("/accounts/details/")) {
    pageTitle = "Mon compte";
  }
  pageTitle = pageTitle || "Espace client";

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      getAccounts();
    }
  }, [isAuthenticated, isLoading]);

  return (
    <ProtectedRoute requiredRoles={[RoleEnum.USER]}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Banner title={pageTitle} />
        <main className="container mx-auto px-4 py-8">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
