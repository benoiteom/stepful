"use client";

import TicketForm from "@/components/TicketForm";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Index() {
  const [submitted, setSubmitted] = useState<boolean>(false);

  const submit = async (data: {
    name: string;
    email: string;
    message: string;
  }) => {
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Network response was not ok");

      setSubmitted(true);
      toast(`Sending email to ${data.email}`, {
        description: `
          <p>Subject: Support Request</p>
          <p>Message: Thank you ${data.name}! We have received your request and will follow up soon.</p>
        `,
        action: {
          label: "Close",
          onClick: () => toast.dismiss(),
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-3xl px-3">
        <main className="w-full flex-1 flex flex-col gap-6">
          <h3 className="font-semibold text-3xl mb-4">How can we help?</h3>
          <p>
            Please fill out your information below and someone from our
            top-notch support staff will be in touch with you!
          </p>

          {!submitted ? (
            <TicketForm submit={submit} />
          ) : (
            <div className="animate-in">
              <p className="mt-6">
                Thank you for your support request. We will get back to you
                soon.
              </p>
              <Button
                className="max-w-[200px] mt-6"
                onClick={() => setSubmitted(false)}
              >
                Submit another request
              </Button>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
