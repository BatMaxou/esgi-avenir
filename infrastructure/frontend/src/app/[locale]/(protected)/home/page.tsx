"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigation } from "@/contexts/NavigationContext";
import ClientDashboard from "@/components/dashboards/ClientDashboard";
import DirectorDashboard from "@/components/dashboards/DirectorDashboard";
import { RoleEnum } from "@/../../../domain/enums/RoleEnum";
import AdvisorDashboard from "@/components/dashboards/AdvisorDashboard";
import { useTranslations } from "next-intl";

export default function Home() {
  const { user } = useAuth();
  const { endNavigation } = useNavigation();
  const t = useTranslations("page.home");

  useEffect(() => {
    endNavigation();
  }, []);

  return user ? (
    user.roles.includes(RoleEnum.DIRECTOR) ? (
      <DirectorDashboard />
    ) : user.roles.includes(RoleEnum.ADVISOR) ? (
      <AdvisorDashboard />
    ) : (
      <ClientDashboard />
    )
  ) : (
    <div>{t("loading")}</div>
  );
}
