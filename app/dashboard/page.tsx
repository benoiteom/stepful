"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TicketList from "@/components/TicketList";
import { useState } from "react";

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    <div className="flex-1 w-full flex flex-col items-center">
      <Navbar />

      <div className="w-full grow">
        <div className="animate-in flex-1 flex opacity-0 px-3 max-h-[calc(100vh-160px)] overflow-auto">
          <main className="flex-1 grow flex flex-col gap-6 max-w-6xl mx-auto">
            <Tabs defaultValue="all" className="m-11">
              <div className="flex justify-between items-center gap-4 mb-10">
                <Input
                  placeholder="Search"
                  className="max-w-[320px]"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="new">New</TabsTrigger>
                  <TabsTrigger value="in progress">In Progress</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="all">
                <TicketList searchTerm={searchTerm} />
              </TabsContent>
              <TabsContent value="new">
                <TicketList searchTerm={searchTerm} filter="new" />
              </TabsContent>
              <TabsContent value="in progress">
                <TicketList searchTerm={searchTerm} filter="in progress" />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
