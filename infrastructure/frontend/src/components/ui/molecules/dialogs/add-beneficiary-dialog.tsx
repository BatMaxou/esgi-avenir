import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/atoms/dialog";
import AddBeneficiaryForm from "@/components/ui/molecules/forms/add-beneficiary-form";
import { useTranslations } from "next-intl";

interface AddBeneficiaryDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AddBeneficiaryDialog = ({ open, setOpen }: AddBeneficiaryDialogProps) => {
  const t = useTranslations("components.dialogs.beneficiary.add");

  const handleSuccess = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="hidden">{t("title")}</DialogTitle>
      <DialogContent className="flex flex-col justify-start items-start gap-8 data-[state=open]:!zoom-in-100 data-[state=open]:slide-in-from-right-20 data-[state=open]:duration-600 sm:right-0 sm:left-auto h-screen sm:max-w-[425px] sm:translate-x-0">
        <DialogHeader className="mb-6">
          <p className="text-lg font-bold">{t("title")}</p>
        </DialogHeader>

        <AddBeneficiaryForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </DialogContent>
    </Dialog>
  );
};

export default AddBeneficiaryDialog;
