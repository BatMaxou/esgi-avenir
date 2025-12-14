import { ReactNode } from "react";

import { NewsProvider } from "@/contexts/NewsContext";

type Props = {
  children: ReactNode;
};

export default function NewsLayout({ children }: Props) {
  return <NewsProvider>
    {children}
  </NewsProvider>
}
