import { Metadata } from "next";

import Landing from "@/components/auth/Landing";

export const metadata: Metadata = {
  title: "Avenir",
  description: "Avenir - Alliance de Valeurs Économiques et Nationnales Investies Responsablement. Gérez vos comptes, votre épargne et vos investissements en toute simplicité avec une banque nouvelle génération.",
  keywords: [
    "banque en ligne",
    "compte bancaire",
    "épargne",
    "investissement",
    "actions",
    "crédit",
    "gestion financière",
    "banque moderne",
    "transfert bancaire",
    "portefeuille d'actions",
    "compte épargne rémunéré",
    "online banking",
    "bank account",
    "savings",
    "investment",
    "stocks",
    "credit",
    "financial management",
    "modern bank",
    "bank transfer",
    "stock portfolio",
    "interest-bearing savings account"
  ],
  authors: [{ name: "Avenir Bank" }],
};

export default function Homa() {

  return <Landing />;
}
