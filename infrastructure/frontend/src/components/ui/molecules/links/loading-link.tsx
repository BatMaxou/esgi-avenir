"use client";

import Link, { LinkProps } from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { MouseEvent, ReactNode } from "react";
import { useNavigation } from "@/contexts/NavigationContext";

type LoadingLinkProps = Omit<LinkProps, "href"> & {
  children: ReactNode;
  className?: string;
  href: string | { pathname: string; params?: Record<string, string | number> };
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

  const getHrefString = (
    href:
      | string
      | { pathname: string; params?: Record<string, string | number> }
  ): string => {
    if (typeof href === "string") {
      return href;
    }

    const { pathname, params } = href;

    if (!params) {
      return pathname;
    }

    let path = pathname;
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`[${key}]`, String(value));
    });

    return path;
  };

  const hrefString = getHrefString(href);

  if (!hrefString) {
    return (
      <a className={className} {...props}>
        {children}
      </a>
    );
  }

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (pathname === hrefString) {
      e.preventDefault();
      return;
    }

    onClick?.(e);

    if (!e.defaultPrevented) {
      e.preventDefault();
      startNavigation();

      router.push(hrefString);
    }
  };

  return (
    <Link
      href={hrefString}
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
}
