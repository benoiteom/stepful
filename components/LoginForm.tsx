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

const FormSchema = z.object({
  email: z.string().email({
    message: "Please provide a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function LoginForm({ submit }: { submit: (data: z.infer<typeof FormSchema>) => void }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submit)}
        className="w-full flex flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="grow">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input autoComplete="email" placeholder="admin@zealthy.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input autoComplete="current-password" type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex justify-end">
          <Button type="submit" className="min-w-[120px]">
            {form.formState.isSubmitting ? <div className="relative"><div className="spinner" /></div> : "Login"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
