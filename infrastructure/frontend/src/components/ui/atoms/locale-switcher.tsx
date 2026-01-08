'use client';

import { useCallback } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from '@/i18n/navigation';
import { Icon } from "@iconify/react";

import { routing } from "@/i18n/routing";
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/atoms/select";

export const LocaleSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname()

  const onChange = useCallback((value: string) => {
    router.replace(pathname, { locale: value });
  }, [router, pathname]);

  return <Select
    onValueChange={onChange}
    defaultValue={locale}
  >
    <SelectTrigger>
      <SelectValue placeholder="Sélectionner un rôle" />
    </SelectTrigger>
    <SelectContent>
      {routing.locales.map((language) => <SelectItem key={language} value={language}>
        <Icon icon={`circle-flags:${language}`} width={20} height={20} />
      </SelectItem>)}
    </SelectContent>
  </Select>
}
