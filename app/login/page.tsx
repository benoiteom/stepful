"use client";

import Footer from "@/components/Footer";
import LoginForm from "@/components/LoginForm";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();

  const [error, setError] = useState<string>("");

  const signIn = async (data: { email: string; password: string }) => {
    setError("");
    try {
      const res = await fetch("/api/auth/signIn", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Network response was not ok");
      return router.push("/dashboard");
    } catch (error: any) {
      setError("Invalid email or password.");
      console.error(error);
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <Navbar hideLogin />

      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-3xl px-3">
        <main className="w-full flex-1 flex flex-col gap-6">
          <h3 className="font-semibold text-3xl mb-8">Admin Dashboard</h3>
          <LoginForm submit={signIn} />

          {!!error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </main>
      </div>

      <Footer />
    </div>
  );
}
