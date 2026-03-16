"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

const contactInputSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Invalid email"),
  tags: z.string().optional(), // Field as string for user input
});

export function ContactForm({
  contact = null,
  onSuccess,
}: {
  contact?: any;
  onSuccess: () => void;
}) {
  const form = useForm<z.infer<typeof contactInputSchema>>({
    resolver: zodResolver(contactInputSchema),
    defaultValues: contact
      ? {
          ...contact,
          tags: Array.isArray(contact.tags) ? contact.tags.join(", ") : contact.tags || "",
        }
      : { name: "", email: "", tags: "" },
  });

  const isEdit = !!contact;

  async function onSubmit(values: z.infer<typeof contactInputSchema>) {
    // Converts tags into array for backend
    const payload = {
      ...values,
      tags: values.tags
        ? values.tags
            .split(",")
            .map(t => t.trim())
            .filter(Boolean)
        : [],
    };
    const res = await fetch(
      isEdit ? `/api/contacts/${contact.id}` : "/api/contacts",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (res.ok) {
      onSuccess();
      form.reset();
    } else {
      const err = await res.json().catch(() => ({}));
      toast.error(
        err?.error?.email?.[0] ||
          err?.error?.name?.[0] ||
          err?.error?.message ||
          "Error saving contact"
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 w-full">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Contact name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="contact@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (comma-separated)</FormLabel>
              <FormControl>
                <Input placeholder="customer, lead, newsletter" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {isEdit ? "Update Contact" : "Add Contact"}
        </Button>
      </form>
    </Form>
  );
}