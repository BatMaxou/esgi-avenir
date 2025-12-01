"use client";

import Link, { LinkProps } from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { MouseEvent, ReactNode } from "react";
import { useNavigation } from "@/contexts/NavigationContext";

type LoadingLinkProps = LinkProps & {
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
};

export function LoadingLink({
  children,
  href,
  className,
  onClick,
  ...props
}: LoadingLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { startNavigation } = useNavigation();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (pathname === href) {
      e.preventDefault();
      return;
    }

    onClick?.(e);

    if (!e.defaultPrevented) {
      e.preventDefault();
      startNavigation();
      router.push(href.toString());
    }
  };

  return (
    <Link href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
