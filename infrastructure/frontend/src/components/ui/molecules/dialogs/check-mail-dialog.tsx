import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/atoms/dialog";
import { Button } from "@/components/ui/atoms/button";
import { Icon } from "@iconify/react";

interface CheckMailDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setFormType: (formType: "login" | "register") => void;
}

const CheckMailDialog = ({
  open,
  setOpen,
  setFormType,
}: CheckMailDialogProps) => {
  const handleClose = () => {
    setOpen(false);
    setFormType("login");
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-lg p-6">
        <div className="flex justify-center">
          <Icon
            icon="material-symbols-light:outgoing-mail-outline-rounded"
            width="100"
            height="100"
          />
        </div>
        <DialogHeader>
          <DialogTitle className="text-center -mt-4">
            Un mail vous à été envoyé
          </DialogTitle>
          <DialogDescription>
            <span>
              Veuillez confirmer l'inscription en cliquant sur le lien dans
              l'email.
            </span>
            <br />
            <span>
              Un compte courant vous sera immédiatement crée à la validation de
              votre compte.
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className="cursor-pointer hover:bg-gray-900 hover:text-white"
              onClick={() => handleClose()}
            >
              J'ai compris
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CheckMailDialog;
