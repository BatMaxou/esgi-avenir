"use client";

import { useNavigation } from "@/contexts/NavigationContext";

export function NavigationLoader() {
  const { isNavigating } = useNavigation();

  if (!isNavigating) return null;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Chargement...</p>
      </div>
    </div>
  );
}
