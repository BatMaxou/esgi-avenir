"use client";
import { useEffect, useState } from "react";
import { Separator } from "@radix-ui/react-separator";
import { useNavigation } from "@/contexts/NavigationContext";
import { Item, ItemContent } from "@/components/ui/item";
import { useAccounts } from "@/contexts/AccountsContext";
import { useBeneficiaries } from "@/contexts/BeneficiariesContext";
import TransferForm from "@/components/ui/molecules/forms/transfer-form";

export default function TransferPage() {
  const { accounts } = useAccounts();
  const { beneficiaries } = useBeneficiaries();
  const { endNavigation } = useNavigation();
  useEffect(() => {
    endNavigation();
  }, []);

  // States

  return (
    <>
      <div className="flex flex-row justify-start gap-8">
        <TransferForm />
        <Separator orientation="vertical" className="h-full border-2" />
        <div className="flex-2 space-y-4">
          <Item className="bg-white p-4 rounded-lg shadow">
            <ItemContent>
              <h2 className="text-lg font-bold">Mes bénéficiaires</h2>
            </ItemContent>
          </Item>
          {/* <Item className="bg-white p-4 rounded-lg shadow">
            <ItemContent>
              <h2 className="text-lg font-bold">Mes derniers virements</h2>
            </ItemContent>
          </Item> */}
        </div>
      </div>
    </>
  );
}
