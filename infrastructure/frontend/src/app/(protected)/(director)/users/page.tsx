"use client";

import { useNavigation } from "@/contexts/NavigationContext";
import { useEffect } from "react";

export default function UsersPage() {
  const { endNavigation } = useNavigation();

  useEffect(() => {
    endNavigation();
  }, []);
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Gestion des utilisateurs</h1>
        <p className="text-gray-600">
          Contenu de la gestion des utilisateurs à implémenter...
        </p>
      </div>
    </div>
  );
}
