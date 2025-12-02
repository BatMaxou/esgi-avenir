import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/atoms/dialog";
import UpdateBeneficiaryForm from "@/components/ui/molecules/forms/update-beneficiary-form";
import { Beneficiary } from "../../../../../../../domain/entities/Beneficiary";

interface UpdateBeneficiaryDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  beneficiary: Beneficiary | null;
}

const UpdateBeneficiaryDialog = ({
  open,
  setOpen,
  beneficiary,
}: UpdateBeneficiaryDialogProps) => {
  const handleUpdateSuccess = () => {
    setOpen(false);
  };

  const handleUpdateCancel = () => {
    setOpen(false);
  };

  if (!beneficiary) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="hidden">Modifier un bénéficiaire</DialogTitle>
      <DialogContent className="flex flex-col justify-start items-start gap-8 data-[state=open]:!zoom-in-100 data-[state=open]:slide-in-from-right-20 data-[state=open]:duration-600 sm:right-0 sm:left-auto h-screen sm:max-w-[425px] sm:translate-x-0">
        <DialogHeader className="mb-6">
          <p className="text-lg font-bold">Modifier un bénéficiaire</p>
        </DialogHeader>

        <UpdateBeneficiaryForm
          beneficiary={beneficiary}
          onUpdateSuccess={handleUpdateSuccess}
          onUpdateCancel={handleUpdateCancel}
          onDeleteSuccess={handleUpdateSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateBeneficiaryDialog;
