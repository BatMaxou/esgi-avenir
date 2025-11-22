"use client";
import { useAuth } from "@/contexts/AuthContext";
import { AccountsDisplay } from "@/components/accounts/AccountsDisplay";
import { Separator } from "@radix-ui/react-separator";
import Link from "next/link";
import { Icon } from "@iconify/react";

export default function Home() {
  const { user, logout } = useAuth();

  return user ? (
    <div className="flex flex-row justify-start gap-8">
      <div className="flex flex-2 flex-col justify-start items-start gap-8">
        <div className="w-full">
          <h2 className="text-lg mb-2 font-bold">Mes comptes</h2>
          <AccountsDisplay displayLength={3} displayStyle="list" />
          <div className="flex flex-row justify-end">
            <Link href="/accounts" className="">
              <p className="text-red-600 font-semibold hover:underline mt-2 inline-block text-end">
                Voir tous mes comptes
                <Icon icon="mdi:arrow-right" className="inline-block ml-1" />
              </p>
            </Link>
          </div>
        </div>
        <div className="w-full overflow-scroll">
          <h2 className="text-lg mb-2 font-bold">Dernières transactions</h2>
          {/* <OperationsHistory displayLength={12} displayStyle="grid" /> */}
        </div>
      </div>
      <Separator />
      <div className="flex-1 space-y-8">
        <div>
          <h2 className="text-lg mb-2 font-bold">Virements</h2>
          <div className="h-48 w-full bg-gradient-to-br from-red-500 to-red-700 rounded-lg shadow-lg">
            <div className="h-full bg-[url('/assets/images/transfer-icon.svg')] bg-no-repeat bg-[320px_40px] bg-[length:150px_150px] flex items-start">
              <h3 className="text-4xl uppercase font-bold text-white drop-shadow-lg p-6">
                Transférer de <br />
                l'argent
              </h3>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg mb-2 font-bold">Investissemnts</h2>
          <div className="h-48 w-full bg-white border-2 border-red-700 rounded-lg shadow-lg">
            <div className="h-full bg-[url('/assets/images/trading-bars-icon.svg')] bg-no-repeat bg-[320px_40px] bg-[length:150px_150px] flex items-start">
              <h3 className="text-4xl uppercase font-bold text-red-600 drop-shadow-lg p-6">
                Consultez vos <br />
                investissements
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
}
