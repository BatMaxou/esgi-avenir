import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/atoms/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/atoms/tabs";
import { Icon } from "@iconify/react";
import { HydratedAccount } from "../../../../../../../domain/entities/Account";
import { Beneficiary } from "../../../../../../../domain/entities/Beneficiary";
import InputSearchLoader from "../inputs/input-search-loader";
import { FilledButton } from "@/components/ui/molecules/buttons/filled-button";

interface TransferFromAccountProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  userAccounts?: HydratedAccount[];
  userBeneficiaries?: Beneficiary[] | null;
  setToAccount: (toAccount: HydratedAccount | Beneficiary | undefined) => void;
  fromAccount?: HydratedAccount | undefined;
  isLoadingAccounts: boolean;
  isLoadingBeneficiaries: boolean;
}

const TransferToAccountDialog = ({
  open,
  setOpen,
  userAccounts,
  userBeneficiaries,
  setToAccount,
  fromAccount,
  isLoadingAccounts,
  isLoadingBeneficiaries,
}: TransferFromAccountProps) => {
  const handleClose = () => {
    setOpen(false);
    setToAccount(undefined);
  };

  const [accounts, setAccounts] = useState<HydratedAccount[]>(
    userAccounts || []
  );
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[] | null>(
    userBeneficiaries || []
  );
  const [newAccountList, setNewAccountList] = useState<HydratedAccount[]>([]);
  const [newBeneficiariesList, setNewBeneficiariesList] = useState<
    Beneficiary[]
  >([]);

  useEffect(() => {
    if (!userBeneficiaries) return;
    setBeneficiaries(userBeneficiaries);
  }, [userBeneficiaries]);

  useEffect(() => {
    setAccounts(newAccountList);
  }, [newAccountList]);

  useEffect(() => {
    setBeneficiaries(newBeneficiariesList);
  }, [newBeneficiariesList]);

  // Tab columns
  const tabs = [
    {
      name: "Mes comptes",
      value: "accounts",
      content: (
        <>
          <InputSearchLoader
            label="Rechercher un compte"
            items={userAccounts!}
            filterOnKey="name"
            setNewItems={setNewAccountList}
          />
          <div className="w-full mt-4 overflow-y-auto space-y-4">
            {isLoadingAccounts ? (
              <p>Chargement des comptes...</p>
            ) : (
              <>
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className={
                      account.iban.value !== fromAccount?.iban.value
                        ? "p-4 border border-gray-300 rounded-lg shadow-sm bg-white flex flex-row justify-between items-center hover:cursor-pointer hover:bg-gray-100"
                        : "p-4 border border-gray-300 rounded-lg shadow-sm flex flex-row justify-between items-center hover:cursor-not-allowed bg-gray-200"
                    }
                    onClick={() => {
                      if (account.iban.value !== fromAccount?.iban.value) {
                        setToAccount(account);
                        setOpen(false);
                      }
                    }}
                  >
                    <div>
                      <p className="font-semibold text-gray-800 mb-1">
                        {account.name}
                      </p>
                    </div>
                    <p
                      className={`text-lg font-bold ${
                        account.amount < 0 ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {account.amount < 0 ? "-" : "+"}
                      {account.amount.toFixed(2)} €
                    </p>
                  </div>
                ))}
              </>
            )}
          </div>
        </>
      ),
    },
    {
      name: "Mes bénéficiaires",
      value: "beneficiaries",
      content: (
        <>
          <InputSearchLoader
            label="Rechercher un bénéficiaire"
            items={beneficiaries!}
            filterOnKey={["firstName", "lastName"]}
            setNewItems={setNewBeneficiariesList}
          />
          <FilledButton
            label="Ajouter un bénéficiaire"
            icon="mdi:plus"
            iconPosition="start"
            className="w-full mt-4"
            onClick={() => {}}
          />
          <div className="w-full mt-4 flex-1 overflow-y-auto space-y-4 h-full">
            {isLoadingBeneficiaries ? (
              <p>Chargement des bénéficiaires...</p>
            ) : (
              <>
                {beneficiaries ? (
                  <>
                    {beneficiaries.map((beneficiary) => (
                      <div
                        key={beneficiary.id}
                        className="p-4 border border-gray-300 rounded-lg shadow-sm bg-white flex flex-row justify-between items-center hover:cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          setToAccount(beneficiary);
                          setOpen(false);
                        }}
                      >
                        <div>
                          <p className="font-semibold text-gray-800 mb-1">
                            {beneficiary.owner?.firstName}{" "}
                            {beneficiary.owner?.lastName}
                          </p>
                          <p className="font-semibold text-gray-800 mb-1">
                            {beneficiary.account?.iban.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <p>Aucun bénéficiaires enregistrés</p>
                )}
              </>
            )}
          </div>
        </>
      ),
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="hidden">Vers le compte</DialogTitle>
      <DialogContent className="flex flex-col justify-start items-start gap-8 data-[state=open]:!zoom-in-100 data-[state=open]:slide-in-from-right-20 data-[state=open]:duration-600 sm:right-0 sm:left-auto max-h-screen h-screen overflow-y-scroll sm:max-w-[425px] sm:translate-x-0">
        <DialogHeader className="mb-6">
          <p className="text-lg font-bold">Vers le compte</p>
        </DialogHeader>

        <div className="w-full max-w-md mt-4 h-full">
          <Tabs defaultValue="accounts" className="gap-4 h-full">
            <TabsList className="bg-background rounded-none border-b p-0">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="bg-background data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none cursor-pointer"
                >
                  {tab.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {tabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="h-full">
                <div className="text-muted-foreground text-sm h-full">
                  {tab.content}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransferToAccountDialog;
