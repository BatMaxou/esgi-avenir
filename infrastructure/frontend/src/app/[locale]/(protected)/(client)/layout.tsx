"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { RoleEnum } from "../../../../../../../domain/enums/RoleEnum";

type Props = {
  children: ReactNode;
};

export default function ClientLayout({ children }: Props) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      // Si l'utilisateur est directeur, le rediriger vers /home
      if (
        user.roles.includes(RoleEnum.DIRECTOR) ||
        user.roles.includes(RoleEnum.ADVISOR)
      ) {
        router.push("/home");
      }
    }
  }, [isLoading, user, router]);

  // Affiche le contenu seulement si ce n'est pas un directeur
  if (
    !isLoading &&
    (user?.roles.includes(RoleEnum.DIRECTOR) ||
      user?.roles.includes(RoleEnum.ADVISOR))
  ) {
    return null;
  }

  return <>{children}</>;
}
