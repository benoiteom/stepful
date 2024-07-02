"use client";

import { Button } from "@/components/ui/button";
import { fetcher } from "@/lib/utils";
import { Calendar, LogOut, Phone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";

type User = {
  id: number;
  name: string;
  email: string;
  created_at: string;
};

export default function Navbar() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authCheck();
  }, []);

  const authCheck = async () => {
    try {
      const res = await fetch("/api/auth");

      if (!res.ok) throw new Error("Failed to authenticate");
      const user = await res.json();

      if (user && user.status !== 400) {
        setUser(user);
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/signOut");
      if (!res.ok) throw new Error("Failed to sign out");

      setUser(null);
      mutate("/api/auth");
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="w-full flex items-center border-b-2 border-b-black px-10 h-20">
      <div className="h-full flex items-center gap-10">
        <div className="min-w-[240px] flex flex-col justify-start items-center">
          <Link href="/">
            <h1 className="text-3xl font-black tracking-widest">COACHING</h1>
          </Link>
        </div>
      </div>

      {!loading && user && (
        <div className="w-full h-full flex items-center justify-between gap-10">
          <div className="ml-8 flex">
            <Button variant="link" onClick={() => router.push("/calendar")}>
              <Calendar size={20} />
              <span className="font-bold ml-2">Calendar</span>
            </Button>
            <Button variant="link" onClick={() => router.push("/calls")}>
              <Phone size={20} />
              <span className="font-bold ml-2">Calls</span>
            </Button>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut size={20} />
            <span className="font-bold ml-2">Logout</span>
          </Button>
        </div>
      )}
    </nav>
  );
}
