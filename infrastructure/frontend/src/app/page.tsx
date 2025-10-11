"use client";

// React
import { useState } from "react";

// Local components
import { LoginForm } from "../components/forms/form-login";
import { RegisterForm } from "../components/forms/form-register";
import Image from "next/image";

// Images
import bgImage from "../../public/assets/home-card.jpg";
import logo from "../../public/assets/logo/logo-avenir.png";

export default function Home() {
  const [formType, setFormType] = useState<"login" | "register">("login");

  function showRegisterForm() {
    setFormType("register");
  }

  function showLoginForm() {
    setFormType("login");
  }

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

          {formType === "login" ? (
            <>
              <h1 className="text-3xl font-bold mb-8">Connexion</h1>
              <LoginForm />
              <p
                style={{ cursor: "pointer" }}
                onClick={() => showRegisterForm()}
              >
                Je veux ouvrir un compte !
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-8">Ouvrir un compte</h1>
              <RegisterForm setFormType={setFormType} />
              <p style={{ cursor: "pointer" }} onClick={() => showLoginForm()}>
                J'ai déjà un compte !
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
