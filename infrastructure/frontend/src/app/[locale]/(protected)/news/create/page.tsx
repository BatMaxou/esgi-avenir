"use client";

import { useEffect } from "react";
import { notFound } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigation } from "@/contexts/NavigationContext";
import { useRouter } from "@/i18n/navigation";
import { RoleEnum } from "../../../../../../../../domain/enums/RoleEnum";
import { CreateNewsForm } from "@/components/ui/molecules/forms/create-news-form";
import { useNews } from "@/contexts/NewsContext";

export default function CreateNewsPage() {
  const { user, isLoading } = useAuth();
  const { endNavigation } = useNavigation();
  const { createNews } = useNews();
  const router = useRouter();

  useEffect(() => {
    endNavigation();
  }, [endNavigation]);

  const isAdvisor = user?.roles.includes(RoleEnum.ADVISOR);

  if (!isLoading && (!user || !isAdvisor)) {
    notFound();
  }

  const handleSubmit = async (data: { title: string; content: string }) => {
    await createNews(data);
    console.log("Creating news:", data);
    router.push("/news");
  };

  const handleCancel = () => {
    router.push("/news");
  };

  return (
    <div className="">
      <CreateNewsForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}
