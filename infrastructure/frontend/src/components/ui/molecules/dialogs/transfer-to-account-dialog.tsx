import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
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
import { HydratedAccount } from "../../../../../../../domain/entities/Account";
import { Beneficiary } from "../../../../../../../domain/entities/Beneficiary";
import InputSearchLoader from "../inputs/input-search-loader";
import { FilledButton } from "@/components/ui/molecules/buttons/filled-button";
import { useBeneficiaries } from "@/contexts/BeneficiariesContext";
import { BeneficiariesList } from "../lists/beneficiaries-list";

interface TransferFromAccountProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  userAccounts?: HydratedAccount[];
  setToAccount: (toAccount: HydratedAccount | Beneficiary | undefined) => void;
  fromAccount?: HydratedAccount | undefined;
  isLoadingAccounts: boolean;
  onOpenAddBeneficiary?: () => void;
}

const TransferToAccountDialog = ({
  open,
  setOpen,
  userAccounts,
  setToAccount,
  fromAccount,
  isLoadingAccounts,
  onOpenAddBeneficiary,
}: TransferFromAccountProps) => {
  const { beneficiaries, isBeneficiariesLoading } = useBeneficiaries();
  const [accounts, setAccounts] = useState<HydratedAccount[]>(
    userAccounts || []
  );

  const [newAccountList, setNewAccountList] = useState<HydratedAccount[]>([]);
  const [newBeneficiariesList, setNewBeneficiariesList] = useState<
    Beneficiary[]
  >(beneficiaries && beneficiaries.length > 0 ? beneficiaries : []);

  const t = useTranslations("components.dialogs.transferTo");

  useEffect(() => {
    setAccounts(newAccountList);
  }, [newAccountList]);

  // Tab columns
  const tabs = [
    {
      name: t("myAccounts"),
      value: "accounts",
      content: (
        <>
          <InputSearchLoader
            label={t("searchAccount")}
            items={userAccounts!}
            filterOnKey="name"
            setNewItems={setNewAccountList}
          />
          <div className="w-full mt-4 overflow-y-auto space-y-4">
            {isLoadingAccounts ? (
              <p>{t("loadingAccounts")}</p>
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
                      {account.amount < 0 ? "" : "+"}
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
      name: t("myBeneficiaries"),
      value: "beneficiaries",
      content: (
        <>
          <InputSearchLoader
            label={t("searchBeneficiary")}
            items={beneficiaries!}
            filterOnKey={["firstName", "lastName", "name"]}
            setNewItems={setNewBeneficiariesList}
          />
          <FilledButton
            label={t("addBeneficiary")}
            icon="mdi:plus"
            iconPosition="start"
            className="w-full mt-4"
            onClick={() => {
              if (onOpenAddBeneficiary) {
                onOpenAddBeneficiary();
              }
            }}
          />
          <div className="w-full mt-4 flex-1 overflow-y-auto space-y-4">
            {isBeneficiariesLoading ? (
              <p>{t("loadingBeneficiaries")}</p>
            ) : (
              <BeneficiariesList
                beneficiaries={newBeneficiariesList}
                onClick={(beneficiary) => {
                  setToAccount(beneficiary);
                  setOpen(false);
                }}
              />
            )}
          </div>
        </>
      ),
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="hidden">{t("title")}</DialogTitle>
      <DialogContent className="flex flex-col justify-start items-start gap-8 data-[state=open]:!zoom-in-100 data-[state=open]:slide-in-from-right-20 data-[state=open]:duration-600 sm:right-0 sm:left-auto max-h-screen h-screen overflow-y-scroll sm:max-w-[425px] sm:translate-x-0">
        <DialogHeader className="mb-6">
          <p className="text-lg font-bold">{t("title")}</p>
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
