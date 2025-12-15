"use client";

import Image from "next/image";
import { LoadingLink } from "@/components/ui/molecules/links/loading-link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex md:flex-row flex-col justify-center items-center md:space-x-8 space-y-4 text-center">
        <div className="flex justify-center mb-8">
          <Image
            src="/assets/logo/logo-large-no-bg.svg"
            alt="Logo Avenir"
            width={200}
            height={150}
            priority
          />
        </div>
        <div className="text-center">
          <h1 className="text-9xl font-bold text-light-orange!">404</h1>
          <h2 className="text-3xl font-semibold mt-4 text-gray-800">
            Page introuvable
          </h2>
          <p className="text-gray-600 mt-2 mb-8">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <LoadingLink
            href="/home"
            className="inline-block px-6 py-3 bg-light-orange text-white font-semibold rounded-lg hover:bg-dark-orange transition-colors"
          >
            Retour à l'accueil
          </LoadingLink>
        </div>
      </div>
    </div>
  );
}
