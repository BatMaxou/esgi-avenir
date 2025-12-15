"use client";

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
import { LoadingLink } from "@/components/ui/molecules/links/loading-link";
import { LocaleSwitcher } from "../../atoms/locale-switcher";

export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const isDirector = user?.roles.includes(RoleEnum.DIRECTOR);
  const isAdvisor = user?.roles.includes(RoleEnum.ADVISOR);

  const navLinks = isDirector
    ? [
        { href: "/home", label: "Accueil" },
        { href: "/users", label: "Utilisateurs" },
        { href: "/settings", label: "Paramètres" },
        { href: "/actions", label: "Actions" },
      ]
    : isAdvisor
    ? [
        { href: "/home", label: "Accueil" },
        { href: "/credits", label: "Crédits" },
      ]
    : [
        { href: "/home", label: "Accueil" },
        { href: "/accounts", label: "Comptes" },
        { href: "/transfers", label: "Virements" },
        { href: "/investments", label: "Investissements" },
      ];

  const isActive = (path: string) => pathname === path;

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
                    Mon compte
                  </DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="cursor-pointer">
                      Profil
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      Paramètres
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
                    Déconnexion
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
