"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleEnum } from "../../../../../../domain/enums/RoleEnum";
import Header from "@/components/ui/molecules/partials/header";
import { useAccounts } from "@/contexts/AccountsContext";
import { useAuth } from "@/contexts/AuthContext";
import { Banner } from "@/components/ui/atoms/banner";
import { useBeneficiaries } from "@/contexts/BeneficiariesContext";
import { NotifierProvider } from "@/contexts/NotifierContext";

type Props = {
  children: ReactNode;
};

export default function ProtectedLayout({ children }: Props) {
  const t = useTranslations("layout.protected");
  const pathname = usePathname();
  const { getAccounts } = useAccounts();
  const { getBeneficiaries } = useBeneficiaries();
  const { isAuthenticated, isLoading } = useAuth();

  const pathWithoutLocale = pathname.replace(/^\/(en|fr)/, "") || "/home";

  // Nommage des routes statiques et dynamiques
  const pageTitles: Record<string, string> = {
    "/home": t("home"),
    "/accueil": t("home"),
    "/accounts": t("accounts"),
    "/comptes": t("accounts"),
    "/transfers": t("transfers"),
    "/virements": t("transfers"),
    "/investments": t("investments"),
    "/investissements": t("investments"),
    "/profile": t("profile"),
    "/profil": t("profile"),
    "/users": t("users"),
    "/utilisateurs": t("users"),
    "/settings": t("settings"),
    "/parametres": t("settings"),
    "/actions": t("actions"),
    "/news": t("news"),
    "/actualites": t("news"),
    "/credits": t("credits"),
    "/credit": t("credit"),
    "/clients": t("clients"),
  };

  let pageTitle = pageTitles[pathWithoutLocale];
  if (
    !pageTitle &&
    (pathWithoutLocale.startsWith("/accounts/details/") ||
      pathWithoutLocale.startsWith("/comptes/details/"))
  ) {
    pageTitle = t("accountDetails");
  }
  if (!pageTitle && pathWithoutLocale.startsWith("/credit")) {
    pageTitle = t("credit");
  }
  if (
    (!pageTitle && pathWithoutLocale.startsWith("/investissement/possedes")) ||
    pathWithoutLocale.startsWith("/investments/owned") ||
    pathWithoutLocale.startsWith("/investissements/possedes")
  ) {
    pageTitle = t("investmentsOwned");
  }
  if (
    (!pageTitle &&
      pathWithoutLocale.startsWith(
        "/investissement/entreprises-disponibles"
      )) ||
    pathWithoutLocale.startsWith("/investments/stocks") ||
    pathWithoutLocale.startsWith("/investissements/entreprises-disponibles")
  ) {
    pageTitle = t("investmentsStocks");
  }
  pageTitle = pageTitle || t("clientArea");

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      getAccounts();
      getBeneficiaries();
    }
  }, [isAuthenticated, isLoading, pathname]);

  return (
    <ProtectedRoute requiredRoles={[RoleEnum.USER]}>
      <NotifierProvider>
        <div className="min-h-screen overflow-y-hidden bg-white">
          <Header />
          <Banner title={pageTitle} />
          <main className="container mx-auto px-4 py-8 h-[calc(100vh-224px)] overflow-y-auto">
            {children}
          </main>
        </div>
      </NotifierProvider>
    </ProtectedRoute>
  );
}
