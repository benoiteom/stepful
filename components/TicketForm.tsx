"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Full name is required.",
  }),
  email: z.string().email({
    message: "Please provide a valid email address.",
  }),
  message: z.string().min(1, {
    message: "Message is required.",
  }),
});

export default function TicketForm({ submit }: { submit: (data: z.infer<typeof FormSchema>) => void }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submit)}
        className="w-full flex flex-col gap-6"
      >
        <div className="w-full flex gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="grow">
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input autoComplete="name" placeholder="First Last" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="grow">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input autoComplete="email" placeholder="support@zealthy.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea placeholder="I have a question about..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex justify-end">
          <Button type="submit" className="min-w-[200px]">
          {form.formState.isSubmitting ? <div className="relative"><div className="spinner" /></div> : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
