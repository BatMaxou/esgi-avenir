import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/atoms/dialog";
import { Item, ItemContent } from "@/components/ui/atoms/item";
import { BeneficiariesList } from "../lists/beneficiaries-list";
import { useBeneficiaries } from "@/contexts/BeneficiariesContext";
import { FilledButton } from "../buttons/filled-button";
import { Beneficiary } from "../../../../../../../domain/entities/Beneficiary";

interface TransferFromAccountProps {
  onOpenAddBeneficiary?: () => void;
  onClick?: (beneficiary: Beneficiary) => void;
}

const UserBeneficiariesDialog = ({
  onOpenAddBeneficiary,
  onClick,
}: TransferFromAccountProps) => {
  const { beneficiaries } = useBeneficiaries();
  return (
    <Dialog>
      <DialogTrigger className="w-full text-start">
        <Item className="bg-white p-4 rounded-lg shadow w-full cursor-pointer hover:bg-gray-50 transition-all ease-in-out text-start">
          <ItemContent>
            <h2 className="text-lg font-bold">Mes bénéficiaires</h2>
          </ItemContent>
        </Item>
      </DialogTrigger>
      <DialogTitle className="hidden">Mes bénéficiaires</DialogTitle>
      <DialogContent className="flex flex-col justify-start items-start gap-8 data-[state=open]:!zoom-in-100 data-[state=open]:slide-in-from-right-20 data-[state=open]:duration-600 sm:right-0 sm:left-auto h-screen sm:max-w-[425px] sm:translate-x-0">
        <DialogHeader className="mb-6">
          <p className="text-lg font-bold">Mes bénéficiaires</p>
        </DialogHeader>

        <FilledButton
          label="Ajouter un bénéficiaire"
          icon="mdi:plus"
          iconPosition="start"
          className="w-full"
          onClick={() => {
            if (onOpenAddBeneficiary) {
              onOpenAddBeneficiary();
            }
          }}
        />
        <div className="w-full mt-4 flex-1 overflow-y-auto space-y-4">
          <BeneficiariesList beneficiaries={beneficiaries} onClick={onClick} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserBeneficiariesDialog;
