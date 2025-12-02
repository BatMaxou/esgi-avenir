"use client";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/atoms/separator";
import { useNavigation } from "@/contexts/NavigationContext";
import { Item, ItemContent } from "@/components/ui/atoms/item";
import TransferForm from "@/components/ui/molecules/forms/transfer-form";
import AddBeneficiaryDialog from "@/components/ui/molecules/dialogs/add-beneficiary-dialog";
import UserBeneficiariesDialog from "@/components/ui/molecules/dialogs/user-beneficiaries-dialog";
import { Beneficiary } from "../../../../../../domain/entities/Beneficiary";
import UpdateBeneficiaryDialog from "@/components/ui/molecules/dialogs/update-beneficiary-dialog";

export default function TransferPage() {
  const { endNavigation } = useNavigation();
  const [openAddBeneficiaryModal, setOpenAddBeneficiaryModal] = useState(false);
  const [openUpdateBeneficiary, setOpenUpdateBeneficiary] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] =
    useState<Beneficiary | null>(null);
  useEffect(() => {
    endNavigation();
  }, []);

  // States

  return (
    <>
      <div className="flex flex-row justify-start gap-8">
        <TransferForm
          onOpenAddBeneficiary={() => setOpenAddBeneficiaryModal(true)}
        />
        <Separator orientation="vertical" className="h-full border-2" />
        <div className="flex-2 space-y-4">
          <UserBeneficiariesDialog
            onOpenAddBeneficiary={() => setOpenAddBeneficiaryModal(true)}
            onClick={(beneficiary: Beneficiary) => {
              setSelectedBeneficiary(beneficiary);
              setOpenUpdateBeneficiary(true);
            }}
          />
        </div>
      </div>
      <AddBeneficiaryDialog
        open={openAddBeneficiaryModal}
        setOpen={setOpenAddBeneficiaryModal}
      />
      <UpdateBeneficiaryDialog
        open={openUpdateBeneficiary}
        setOpen={setOpenUpdateBeneficiary}
        beneficiary={selectedBeneficiary}
      />
    </>
  );
}
