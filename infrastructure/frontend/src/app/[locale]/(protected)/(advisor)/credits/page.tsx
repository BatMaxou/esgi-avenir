"use client";

import { useNavigation } from "@/contexts/NavigationContext";
import { useEffect, useState } from "react";

export default function CreditsPage() {
  const { endNavigation } = useNavigation();

  useEffect(() => {
    endNavigation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
