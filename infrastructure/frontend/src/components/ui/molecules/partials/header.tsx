"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { RoleEnum } from "@/../../../domain/enums/RoleEnum";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/atoms/dropdown-menu";
import { Icon } from "@iconify/react";
import { LoadingLink } from "@/components/ui/molecules/links/loading-link";
import { LocaleSwitcher } from "../../atoms/locale-switcher";
import { useRouter } from "@/i18n/navigation";
import { Item, ItemContent, ItemMedia } from "@/components/ui/atoms/item";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/atoms/avatar";
import { Skeleton } from "../../atoms/skeleton";
import { useNotifications } from "@/contexts/NotificationsContext";

export default function Header() {
  const t = useTranslations("components.partials.header");
  const { user, logout } = useAuth();
  const { isNotificationsLoading, notifications, getNotifications } =
    useNotifications();
  const pathname = usePathname();
  const router = useRouter();
  const [isFetchLoading, setIsFetchLoading] = useState(false);

  const isDirector = user?.roles.includes(RoleEnum.DIRECTOR);
  const isAdvisor = user?.roles.includes(RoleEnum.ADVISOR);

  const navLinks = isDirector
    ? [
        { href: "/home", label: t("home") },
        { href: "/users", label: t("users") },
        { href: "/settings", label: t("settings") },
        { href: "/actions", label: t("actions") },
      ]
    : isAdvisor
    ? [
        { href: "/home", label: t("home") },
        { href: "/credits", label: t("credits") },
        { href: "/clients", label: t("clients") },
      ]
    : [
        { href: "/home", label: t("home") },
        { href: "/accounts", label: t("accounts") },
        { href: "/transfers", label: t("transfers") },
        { href: "/investments", label: t("investments") },
      ];

  const isActive = (path: string) => pathname === path;

  const fetchNotifications = async () => {
    if (!isFetchLoading) {
      setIsFetchLoading(true);
      await getNotifications();
      setIsFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <header className="bg-white shadow-md border-b-4 border-red-600 sticky">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center justify-between gap-8 h-full">
            <LoadingLink href="/home" className="flex items-center space-x-2">
              <img
                src="/assets/logo/logo-flat-no-bg.svg"
                alt="Avenir Logo"
                width={150}
                height={40}
                className="object-contain"
              />
            </LoadingLink>

            <nav className="hidden md:flex h-full">
              {navLinks.map((link) => (
                <LoadingLink
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-red-600 flex flex-col justify-center items-center px-4 ${
                    isActive(link.href)
                      ? "text-red-600 border-b-2 border-red-600 bg-gray-100"
                      : "text-gray-700 border-b-2 border-white"
                  } hover:bg-gray-50 hover:border-b-2 hover:border-red-600 transition-all ease-in-out duration-500`}
                >
                  {link.label}
                </LoadingLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="h-10">
                <Icon
                  icon="iconamoon:notification-light"
                  width="24"
                  height="24"
                  className="cursor-pointer"
                  style={{ color: "#000" }}
                  onClick={async () => {
                    await fetchNotifications();
                  }}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-w-md min-w-md">
                <>
                  <div className="p-2 border-b border-gray-200">
                    <p className="font-bold">{t("notifications_title")}</p>
                  </div>
                  <ul className="flex flex-col gap-2 py-2 max-h-80 overflow-y-auto">
                    {isNotificationsLoading || isFetchLoading ? (
                      <Item
                        className="p-4 border border-gray-100 bg-gray-50 rounded-lg shadow-md flex flex-row justify-between items-center"
                        asChild
                      >
                        <ItemMedia>
                          <Skeleton className="bg-gray-200 rounded-full w-10 h-10" />
                        </ItemMedia>
                        <ItemContent>
                          <Skeleton className="h-6 bg-gray-200 rounded w-20" />
                        </ItemContent>
                      </Item>
                    ) : notifications.length > 0 ? (
                      <>
                        {notifications.slice(0, 4).map((notification) => (
                          <Item
                            className="p-2 border border-gray-100 bg-gray-50 rounded-lg shadow-md flex flex-row justify-between items-center"
                            asChild
                            key={notification.id}
                          >
                            <li>
                              <ItemMedia>
                                <Avatar className="size-8 bg-red-700 justify-center items-center ">
                                  {notification.type === "global" ? (
                                    <>
                                      <AvatarImage
                                        src="/assets/images/global-notification-icon.svg"
                                        className="w-6 h-6"
                                      />
                                      <AvatarFallback>global</AvatarFallback>
                                    </>
                                  ) : (
                                    <>
                                      <AvatarImage
                                        src="/assets/images/private-notification-icon.svg"
                                        className="w-6 h-6"
                                      />
                                      <AvatarFallback>private</AvatarFallback>
                                    </>
                                  )}
                                </Avatar>
                              </ItemMedia>
                              <ItemContent>
                                <p className="text-sm text-ellipsis overflow-hidden whitespace-nowrap">
                                  {notification.content}
                                </p>
                              </ItemContent>
                            </li>
                          </Item>
                        ))}
                        {notifications.length > 4 && (
                          <div className="text-center text-sm text-gray-600 font-semibold">
                            {t("andMore", {
                              count: notifications.length - 4,
                            })}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="p-4">{t("noNotifications")}</div>
                    )}
                  </ul>
                </>
                {notifications.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-center justify-center font-medium text-red-600 hover:text-red-700"
                      onClick={() => router.push("/notifications")}
                    >
                      {t("seeAllNotifications")}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Icon
              icon="mynaui:chat-messages"
              width="24"
              height="24"
              className="cursor-pointer"
              onClick={() => router.push("/messages")}
            />
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="hidden md:flex items-center space-x-3 cursor-pointer">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center text-white font-semibold">
                      {user.firstName?.charAt(0)}
                      {user.lastName?.charAt(0)}
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuLabel className="font-semibold">
                    {t("myAccount")}
                  </DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="cursor-pointer">
                      {t("profile")}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      {t("settings")}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() =>
                      window.open(
                        "https://github.com/BatMaxou/esgi-avenir",
                        "_blank"
                      )
                    }
                  >
                    GitHub
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => logout()}
                  >
                    {t("logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <LocaleSwitcher />
          </div>
        </div>
      </div>

      <div className="md:hidden border-t border-gray-200">
        <nav className="flex overflow-x-auto">
          {navLinks.map((link) => (
            <LoadingLink
              key={link.href}
              href={link.href}
              className={`flex-1 text-center py-3 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "text-red-600 border-b-2 border-red-600 bg-red-50"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {link.label}
            </LoadingLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
