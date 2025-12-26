"use client";

import { StockMarketCard } from "@/components/ui/molecules/cards/market-stocks-card";
import { UserStocksCard } from "@/components/ui/molecules/cards/user-stocks-card";
import { RecentCompaniesCard } from "@/components/ui/molecules/cards/recent-companies-card";
import { UserCompaniesCard } from "@/components/ui/molecules/cards/user-companies-card";
import { useNavigation } from "@/contexts/NavigationContext";
import { useEffect } from "react";

export default function InvestmentsPage() {
  const { endNavigation } = useNavigation();

  useEffect(() => {
    endNavigation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserStocksCard />
        <StockMarketCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserCompaniesCard />
        <RecentCompaniesCard />
      </div>
    </div>
  );
}
