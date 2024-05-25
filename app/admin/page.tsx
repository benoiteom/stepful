import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Dashboard from "@/components/Dashboard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function Admin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <>
      <Navbar />
      <div className="w-full grow -my-20">
        <div className="animate-in flex-1 flex opacity-0 px-3 max-h-[calc(100vh-160px)] overflow-auto">
          <main className="flex-1 grow flex flex-col gap-6 max-w-6xl mx-auto">
            <Dashboard />
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
