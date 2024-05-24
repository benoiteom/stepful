"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { fetcher } from "@/lib/utils";
import { LogIn, LogOut } from "lucide-react";
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

export default function Navbar({ hideLogin }: { hideLogin?: boolean }) {
  const router = useRouter();

  const { data, error, isLoading } = useSWR("/api/auth", fetcher);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (data && data.status !== 400 && !error) {
      setUser(data);
    } else {
      setUser(null);
    }
  }, [data]);

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
    <nav className="w-full flex items-center justify-between border-b-2 border-b-black px-10 h-20">
      <div className="w-full h-full flex items-center gap-10">
        <div className="min-w-[220px] flex flex-col justify-start items-center">
          <Link href="/">
            <h1 className="text-4xl font-black tracking-widest">SUPPORT</h1>
          </Link>
        </div>
        <div className="border-r-2 border-r-black h-full" />
      </div>
      {!hideLogin && !isLoading && (
        !user ? (
          <Link className={buttonVariants({ variant: "outline" })} href="/login">
            <LogIn size={20} />
            <span className="font-bold ml-2">Login</span>
          </Link>
        ) : (
          <Button variant="outline" onClick={handleLogout}>
            <LogOut size={20} />
            <span className="font-bold ml-2">Logout</span>
          </Button>
        )
      )}
    </nav>
  );
}
