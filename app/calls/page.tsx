"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Call = {
  id: number;
  student_id: string;
  coach_id: string;
  satisfaction: number;
  notes: string;
  time_slot_id: number;
};

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  created_at: string;
};

export default function Calls() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [calls, setCalls] = useState<Call[]>([]);

  useEffect(() => {
    authCheck();
  }, []);

  const authCheck = async () => {
    try {
      const res = await fetch("/api/auth");

      if (!res.ok) throw new Error("Failed to get slots for student");
      const user = await res.json();

      if (user && user.status !== 400) {
        setUser(user);
      } else {
        router.push("/");
      }

      getUserCalls(user);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getUserCalls = async (user: User) => {
    try {
      let res;
      if (user.email.includes("student")) {
        res = await fetch(`/api/calls?student_id=${user.id}`);
      } else if (user.email.includes("coach")) {
        res = await fetch(`/api/calls?coach_id=${user.id}`);
      }
      if (!res?.ok) throw new Error("Failed to get calls");

      setCalls(await res.json());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="w-full grow -my-20">
        <div className="animate-in flex-1 flex opacity-0 px-3 max-h-[calc(100vh-160px)] overflow-auto">
          <main className="flex-1 grow flex flex-col gap-6 max-w-3xl mx-auto">
            <p className="text-3xl font-bold mt-12">Calls</p>
            {loading ? (
              <div className="relative h-20">
                <div className="spinner spinner-dark"></div>
              </div>
            ) : (
              <>
                {calls.map((call) => (
                  <div key={call.id} className="flex flex-col gap-2">
                    <p className="font-bold">Call</p>
                    <p>Student: {call.student_id}</p>
                    <p>Coach: {call.coach_id}</p>
                    <p>Satisfaction: {call.satisfaction}</p>
                    <p>Notes: {call.notes}</p>
                  </div>
                ))}
              </>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
