"use client";

// React
import { useState, useEffect } from "react";

// Local components
import Image from "next/image";

//  Components
import { useSearchParams, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { Spinner } from "@/components/ui/atoms/spinner";

// Images
import bgImage from "../../../../public/assets/home-card.jpg";
import logo from "../../../../public/assets/logo/logo-avenir.png";
import { useAuth } from "@/contexts/AuthContext";

export default function ConfirmRegister() {
  const [loading, setLoading] = useState(true);
  const [confirmState, setConfirmState] = useState<
    "false" | "success" | "error"
  >("false");
  const { confirmRegistration: confirm } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const token = searchParams.get("token");
    if (!token) {
      setLoading(false);
      router.push("/");
      return;
    }

    confirmRegistration(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirmRegistration = async (token: string) => {
    const response = await confirm(token);

    if (response) {
      setConfirmState("success");
      setLoading(false);
    } else {
      setConfirmState("error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen max-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src={bgImage}
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="flex-1 lg:w-1/2 flex items-center justify-center bg-white px-8 py-12">
        <div className="max-w-lg w-full space-y-4">
          <div className="text-center">
            <Image
              src={logo}
              alt="Avenir Logo"
              sizes="100vw"
              className="w-full h-[150px] object-cover mb-8"
            />
          </div>

          {loading && (
            <div className="space-y-4 text-center">
              <div className="w-full flex items-center justify-center">
                <Spinner className="size-12!" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Confirmation de votre votre inscription...
              </h2>
            </div>
          )}

          {!loading && confirmState === "success" && (
            <div className="space-y-4 text-center">
              <div className="w-full flex items-center justify-center">
                <Icon
                  icon="prime:check-circle"
                  width="48"
                  height="48"
                  style={{ color: "#48c455" }}
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Inscription validée !
              </h2>
              <p className="text-small text-gray-900 mb-8">
                Vous allez être redirigé vers la page de connexion dans quelques
                instants.
              </p>
            </div>
          )}
          {!loading && confirmState === "error" && (
            <div className="space-y-4 text-center">
              <div className="w-full flex items-center justify-center">
                <Icon
                  icon="prime:times-circle"
                  width="48"
                  height="48"
                  style={{ color: "#eb2600" }}
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Inscription échouée !
              </h2>
              <p className="text-small text-gray-900 mb-8">
                Veuillez contacter un administrateur si l'erreur persiste.
              </p>
              <p className="text-small text-gray-900 mb-8">
                Vous allez être redirigé vers la page de connexion dans quelques
                instants.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
