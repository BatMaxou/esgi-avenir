"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleEnum } from "../../../../../domain/enums/RoleEnum";
import Header from "@/components/ui/molecules/partials/header";
import { useAccounts } from "@/contexts/AccountsContext";
import { useAuth } from "@/contexts/AuthContext";
import { Banner } from "@/components/ui/atoms/banner";
import { useBeneficiaries } from "@/contexts/BeneficiariesContext";

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
  "/users": "Gestion des utilisateurs",
  "/settings": "Paramètres de la banque",
  "/actions": "Gestion des actions",
};

export default function ProtectedLayout({ children }: Props) {
  const pathname = usePathname();
  const { getAccounts } = useAccounts();
  const { getBeneficiaries } = useBeneficiaries();
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
      getBeneficiaries();
    }
  }, [isAuthenticated, isLoading, pathname]);

  return (
    <ProtectedRoute requiredRoles={[RoleEnum.USER]}>
      <div className="min-h-screen max-h-screen overflow-y-hidden bg-white">
        <Header />
        <Banner title={pageTitle} />
        <main className="container mx-auto px-4 py-8">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
