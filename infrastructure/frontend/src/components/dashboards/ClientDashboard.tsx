"use client";
import { AccountsDisplay } from "@/components/ui/molecules/lists/accounts-display";
import { Separator } from "@/components/ui/atoms/separator";
import { Icon } from "@iconify/react";
import { LoadingLink } from "@/components/ui/molecules/links/loading-link";
import { TransferCard } from "@/components/ui/molecules/cards/transfer-card";
import InvestmentCard from "@/components/ui/molecules/cards/investment-card";

export default function ClientDashboard() {
  return (
    <div className="flex flex-row justify-start gap-8">
      <div className="flex flex-2 flex-col justify-start items-start gap-8">
        <div className="w-full">
          <h2 className="text-lg mb-2 font-bold">Mes comptes</h2>
          <AccountsDisplay displayLength={3} displayStyle="list" />
          <div className="flex flex-row justify-end">
            <LoadingLink href="/accounts" className="">
              <p className="text-red-600 font-semibold hover:underline mt-2 inline-block text-end">
                Voir tous mes comptes
                <Icon icon="mdi:arrow-right" className="inline-block ml-1" />
              </p>
            </LoadingLink>
          </div>
        </div>
      </div>
      <Separator orientation="vertical" className="h-full border-2" />
      <div className="flex-1 space-y-8">
        <div>
          <h2 className="text-lg mb-2 font-bold">Virements</h2>
          <LoadingLink href="/transfers">
            <TransferCard />
          </LoadingLink>
        </div>
        <div>
          <h2 className="text-lg mb-2 font-bold">Investissemnts</h2>
          <LoadingLink href="/investments">
            <InvestmentCard />
          </LoadingLink>
        </div>
      </div>
    </div>
  );
}
