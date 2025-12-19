"use client";

import { useNavigation } from "@/contexts/NavigationContext";
import { useEffect } from "react";
import { useStocks } from "@/contexts/StocksContext";
import { StocksDataTable } from "@/components/ui/organisms/StocksDataTable";

export default function DirectorActionsPage() {
  const { endNavigation } = useNavigation();
  const { isStocksLoading, stocks, getStocks } = useStocks();

  useEffect(() => {
    getStocks();
    endNavigation();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <StocksDataTable data={stocks} loading={isStocksLoading} />
      </div>
    </div>
  );
}
