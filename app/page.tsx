"use client";

import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserSelect } from "@/components/UserSelect";

export default function Index() {
  const router = useRouter();

  const [username, setUsername] = useState<string>('coach');
  
  const login = async (): Promise<void> => {
    try {
      const res = await fetch("/api/auth/signIn", {
        method: "POST",
        body: JSON.stringify({ username }),
      });

      if (!res.ok) throw new Error("Network response was not ok");
      router.push("/calendar");
    } catch (error: any) {
      console.error(error);
    }
  }

  return (
    <>
      <Navbar />
      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-3xl px-3">
        <main className="w-full flex-1 flex flex-col gap-6">
          <h3 className="font-semibold text-3xl mb-4">Welcome to Stepful coaching!</h3>
          <p>Please sign in to get started.</p>

          <div className="w-full flex items-center gap-4 mt-4">
            <UserSelect value={username} setValue={setUsername} />
            <Button
              className="w-full max-w-32 rounded-lg"
              variant="outline"
              onClick={login}
            >
              <LogIn size={20} />
              <span className="font-semibold ml-3">Login</span>
            </Button>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
