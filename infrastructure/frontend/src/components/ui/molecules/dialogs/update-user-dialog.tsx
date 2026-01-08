"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/atoms/dialog";
import { Button } from "@/components/ui/atoms/button";
import { Input } from "@/components/ui/atoms/input";
import { Label } from "@/components/ui/atoms/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/atoms/select";
import { LoaderCircleIcon } from "lucide-react";
import { RoleEnum } from "../../../../../../../domain/enums/RoleEnum";
import { FilledButton } from "../buttons/filled-button";
import { useTranslations } from "next-intl";

interface UpdateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    roles: RoleEnum[];
  };
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    email: string;
    roles: RoleEnum[];
  }) => Promise<void>;
  isLoading: boolean;
}

export function UpdateUserDialog({
  open,
  onOpenChange,
  user,
  onSubmit,
  isLoading,
}: UpdateUserDialogProps) {
  const t = useTranslations("components.dialogs.user.update");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    roles: [] as RoleEnum[],
  });

  useEffect(() => {
    if (open) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roles: user.roles,
      });
    }
  }, [open, user]);

  const handleSubmit = async () => {
    await onSubmit(formData);
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => {
      const newRoles: RoleEnum[] = prev.roles.filter(
        (role) => role !== RoleEnum.DIRECTOR && role !== RoleEnum.ADVISOR
      );

      if (value === RoleEnum.DIRECTOR) {
        newRoles.push(RoleEnum.DIRECTOR);
      } else if (value === RoleEnum.ADVISOR) {
        newRoles.push(RoleEnum.ADVISOR);
      }

      return { ...prev, roles: newRoles };
    });
  };

  const getCurrentRoleValue = () => {
    if (formData.roles.includes(RoleEnum.DIRECTOR)) return RoleEnum.DIRECTOR;
    if (formData.roles.includes(RoleEnum.ADVISOR)) return RoleEnum.ADVISOR;
    return RoleEnum.USER;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstName" className="text-right">
              {t("firstName")}
            </Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right">
              {t("lastName")}
            </Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              {t("email")}
            </Label>
            <Input
              id="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">{t("role")}</Label>
            <div className="col-span-3">
              <Select
                value={getCurrentRoleValue()}
                onValueChange={handleRoleChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("rolePlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={RoleEnum.USER}>
                    {t("roleClient")}
                  </SelectItem>
                  <SelectItem value={RoleEnum.ADVISOR}>
                    {t("roleAdvisor")}
                  </SelectItem>
                  <SelectItem value={RoleEnum.DIRECTOR}>
                    {t("roleDirector")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {t("cancel")}
          </Button>
          <FilledButton
            label={t("save")}
            onClick={handleSubmit}
            loading={isLoading}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
