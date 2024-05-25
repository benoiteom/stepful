"use client";

import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TicketList from "@/components/TicketList";
import { useState } from "react";

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    <Tabs defaultValue="all" className="m-11">
      <div className="flex justify-between items-center gap-4 mb-10">
        <Input
          placeholder="Search"
          autoComplete="off"
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
  );
}
