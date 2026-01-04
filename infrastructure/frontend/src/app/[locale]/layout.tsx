import type { Metadata } from "next";
import { ReactNode } from "react";
import { Raleway } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";

import "../globals.css";
import { ApiClientProvider } from "@/contexts/ApiContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/atoms/sonner";
import { AccountsProvider } from "@/contexts/AccountsContext";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { NavigationLoader } from "@/components/providers/NavigationLoader";
import { BeneficiariesProvider } from "@/contexts/BeneficiariesContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { UsersProvider } from "@/contexts/UsersContext";
import { SseApiClientProvider } from "@/contexts/SseApiContext";
import { OperationsProvider } from "@/contexts/OperationsContext";
import { BankCreditsProvider } from "@/contexts/BankCreditContext";
import { routing } from "@/i18n/routing";
import { StockOrdersProvider } from "@/contexts/StockOrdersContext";
import { StocksProvider } from "@/contexts/StocksContext";
import { FinancialSecuritiesProvider } from "@/contexts/FinancialSecuritiesContext";
import { WebsocketClientProvider } from "@/contexts/WebsocketContext";
import { ChannelProvider } from "@/contexts/ChannelContext";

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
});

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <NavigationProvider>
      <SseApiClientProvider>
        <WebsocketClientProvider>
          <ApiClientProvider>
            <AuthProvider>
              <AccountsProvider>
                <OperationsProvider>
                  <BeneficiariesProvider>
                    <SettingsProvider>
                      <UsersProvider>
                        <BankCreditsProvider>
                          <StockOrdersProvider>
                            <FinancialSecuritiesProvider>
                              <StocksProvider>
                                <ChannelProvider>{children}</ChannelProvider>
                              </StocksProvider>
                            </FinancialSecuritiesProvider>
                          </StockOrdersProvider>
                        </BankCreditsProvider>
                      </UsersProvider>
                    </SettingsProvider>
                  </BeneficiariesProvider>
                </OperationsProvider>
              </AccountsProvider>
            </AuthProvider>
          </ApiClientProvider>
        </WebsocketClientProvider>
      </SseApiClientProvider>
    </NavigationProvider>
  );
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={raleway.variable} suppressHydrationWarning={true}>
        <NextIntlClientProvider>
          <Providers>
            <NavigationLoader>{children}</NavigationLoader>
          </Providers>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
