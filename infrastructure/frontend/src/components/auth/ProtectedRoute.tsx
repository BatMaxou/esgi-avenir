"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { RoleEnum } from "../../../../../domain/enums/RoleEnum";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRoles?: RoleEnum[];
  redirectTo?: string;
};

export const ProtectedRoute = ({
  children,
  requiredRoles = [],
  redirectTo = "/",
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      if (requiredRoles.length > 0 && user) {
        const hasRequiredRole = user.roles?.some((role) =>
          requiredRoles.includes(role as RoleEnum)
        );

        if (!hasRequiredRole) {
          router.push("/unauthorized");
          return;
        }
      }

      if (user?.roles?.includes(RoleEnum.BANNED)) {
        router.push("/banned");
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, router, requiredRoles, redirectTo]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = user.roles?.some((role) =>
      requiredRoles.includes(role as RoleEnum)
    );

    if (!hasRequiredRole) {
      return null;
    }
  }

  return <>{children}</>;
};
