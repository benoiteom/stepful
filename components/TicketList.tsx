"use client";

import { Mail, Trash2 } from "lucide-react";
import useSWR, { mutate } from "swr";
import moment from "moment";
import StatusDropdown from "./StatusDropdown";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { fetcher } from "@/lib/utils";

type Ticket = {
  id: number;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
  responses: {
    id: number;
    description: string;
  }[];
};

export default function TicketList({
  searchTerm,
  filter = "",
}: {
  searchTerm: string;
  filter?: string;
}) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isStatusSubmitting, setIsStatusSubmitting] = useState<number | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [notifyOnSend, setNotifyOnSend] = useState<boolean>(true);
  const [response, setResponse] = useState<string>("");

  const { data, error, isLoading } = useSWR("/api/tickets", fetcher);

  useEffect(() => {
    if (data && !data.error && !error) {
      setFilteredTickets(
        data
          .filter(
            (ticket: Ticket) =>
              (ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ticket.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ticket.message
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())) &&
              (filter === "" || ticket.status === filter)
          )
          .sort(
            (a: Ticket, b: Ticket) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          ) || []
      );
    } else {
      setFilteredTickets([]);
    }
  }, [data, searchTerm, filter]);

  const formatDate = (date: string) => moment(date).format("MMMM D YYYY");

  const handleUpdateStatus = async (id: number, status: string) => {
    setIsStatusSubmitting(id);
    try {
      const res = await fetch(`/api/tickets/status`, {
        method: "PATCH",
        body: JSON.stringify({ ticket_id: id, status }),
      });
      if (!res.ok) throw new Error("Network response was not ok");

      mutate("/api/tickets");
    } catch (error) {
      console.error(error);
    } finally {
      setIsStatusSubmitting(null);
    }
  };

  const submit = async (id: number, email: string) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/responses", {
        method: "POST",
        body: JSON.stringify({ ticket_id: id, response }),
      });
      if (!res.ok) throw new Error("Network response was not ok");

      if (notifyOnSend) {
        toast(`Sending email to ${email}`, {
          description: `
            <p>Subject: Re: Support Request</p>
            <p>Message: ${response}</p>
          `,
          action: {
            label: "Close",
            onClick: () => toast.dismiss(),
          },
        });
      }
      await mutate("/api/tickets");
      setResponse("");
      setSelectedId(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/tickets`, {
        method: "DELETE",
        body: JSON.stringify({ ticket_id: id }),
      });
      if (!res.ok) throw new Error("Network response was not ok");
      mutate("/api/tickets");
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-20 relative">
        <div className="spinner spinner-dark" />
      </div>
    );
  } else if (!filteredTickets.length) {
    return (
      <div className="w-full h-20 flex justify-center items-center">
        <p>No results found</p>
      </div>
    );
  }
  return filteredTickets.map((ticket: Ticket, index: number) => (
    <div
      key={`${ticket.id}-${index}`}
      className={`animate-in w-full border-zinc-200 border rounded-lg px-8 py-4 my-6 transition-all duration-500 ${
        selectedId === ticket.id && "shadow-md"
      }`}
    >
      <div className="flex justify-between mb-4">
        <div>
          <p className="font-bold text-lg">{ticket.name}</p>
          <div className="flex items-center gap-2">
            <Mail size={18} />
            <p className="font-semibold text-sm">{ticket.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <p className="">{formatDate(ticket.created_at)}</p>
          <Button
            variant="ghost"
            size="sm"
            className="-mr-3"
            onClick={() => handleDelete(ticket.id)}
          >
            {isDeleting === ticket.id ? (
              <div className="relative w-5 h-5">
                <div className="spinner spinner-dark" />
              </div>
            ) : (
              <Trash2 size={20} />
            )}
          </Button>
        </div>
      </div>
      <div className="w-full">
        <p className="text-md text-zinc-600 mb-4">{ticket.message}</p>
        {ticket.responses.map((response, index) => (
          <div className="flex mb-4" key={`${response.id}-${index}`}>
            <div className="w-2 h-2 shrink-0 bg-zinc-600 rounded-full mr-4 mt-2 bg-zinc-200" />
            <p className="text-zinc-600">{response.description}</p>
          </div>
        ))}
      </div>
      <div className="w-full flex justify-between mb-1">
        <div className="flex items-center gap-7">
          <StatusDropdown
            statusKey={ticket.status}
            setStatus={(status) => handleUpdateStatus(ticket.id, status)}
          />
          {isStatusSubmitting === ticket.id && (
            <div className="relative">
              <div className="spinner spinner-dark" />
            </div>
          )}
        </div>
        <Button
          size="sm"
          className="min-w-[124px]"
          disabled={selectedId === ticket.id}
          onClick={() => setSelectedId(ticket.id)}
        >
          Respond
        </Button>
      </div>
      {selectedId === ticket.id && (
        <>
          <Textarea
            className="w-full my-6"
            placeholder="Type your response here..."
            onChange={(e) => setResponse(e.target.value)}
          />
          <div className="w-full flex justify-between gap-6 mb-1">
            <div className="flex items-center gap-6">
              <Button
                disabled={!response}
                className="min-w-[150px] relative"
                onClick={() => submit(ticket.id, ticket.email)}
              >
                {isSubmitting ? <div className="spinner" /> : "Send"}
              </Button>
              <div className="flex items-center gap-2">
                <Switch
                  id="send-email"
                  defaultChecked
                  onCheckedChange={(e) => setNotifyOnSend(e)}
                />
                <Label htmlFor="send-email">Notify user</Label>
              </div>
            </div>
            <Button
              variant="outline"
              className="min-w-[150px]"
              onClick={() => setSelectedId(null)}
            >
              Cancel
            </Button>
          </div>
        </>
      )}
    </div>
  ));
}
