"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useUsers } from "@/contexts/UsersContext";
import { useAccounts } from "@/contexts/AccountsContext";
import { UserInformationsCard } from "@/components/ui/molecules/cards/user-informations-card";
import { Button } from "@/components/ui/atoms/button";
import { User } from "../../../../../../../../../domain/entities/User";
import { LoaderCircleIcon, ArrowLeftIcon } from "lucide-react";
import { AccountsDisplay } from "@/components/ui/molecules/lists/accounts-display";
import { Separator } from "@/components/ui/atoms/separator";
import { useTranslations } from "next-intl";

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { getUser, user, isUserLoading } = useUsers();
  const { getUserAccounts, accounts, isAccountsLoading } = useAccounts();
  const t = useTranslations("page.clients.details");
  const tButton = useTranslations("buttons");

  const [isUserFetched, setIsUserFetched] = useState(false);

  const userId = Number(params.id);

  useEffect(() => {
    if (userId) {
      getUser(userId);
      getUserAccounts(userId);
      setIsUserFetched(true);
    }
  }, [userId]);

  useEffect(() => {
    if (isUserFetched && !isUserLoading && !user) {
      notFound();
    }
  }, [isUserFetched, isUserLoading, user]);

  if (isUserLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoaderCircleIcon className="animate-spin h-12 w-12 text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoaderCircleIcon className="animate-spin h-12 w-12 text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          {tButton("back")}
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <UserInformationsCard
          user={
            user as Pick<User, "firstName" | "lastName" | "email" | "roles">
          }
        />
      </div>
      <Separator orientation="horizontal" />
      <div className="grid grid-cols-1 gap-6">
        <h2 className="text-lg font-medium">{t("accountsTitle")}</h2>
        {accounts.length > 0 ? (
          <AccountsDisplay consultation={true} />
        ) : (
          <p>{t("noAccount")}</p>
        )}
      </div>
    </div>
  );
}
