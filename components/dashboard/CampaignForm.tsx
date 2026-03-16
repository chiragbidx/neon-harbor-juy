"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const campaignInputSchema = z.object({
  name: z.string().min(2, "Campaign name is required"),
  subject: z.string().min(2, "Subject is required"),
  body: z.string().min(2, "Body is required"),
  scheduledAt: z.string().optional(),
});

export function CampaignForm({
  campaign = null,
  onSuccess,
}: {
  campaign?: any;
  onSuccess: () => void;
}) {
  const form = useForm<z.infer<typeof campaignInputSchema>>({
    resolver: zodResolver(campaignInputSchema),
    defaultValues: campaign || { name: "", subject: "", body: "" },
  });

  const isEdit = !!campaign;

  async function onSubmit(values: z.infer<typeof campaignInputSchema>) {
    const action = isEdit
      ? fetch(`/api/campaigns/${campaign.id}`, {
          method: "PUT",
          body: JSON.stringify(values),
          headers: { "Content-Type": "application/json" },
        })
      : fetch("/api/campaigns", {
          method: "POST",
          body: JSON.stringify(values),
          headers: { "Content-Type": "application/json" },
        });

    const res = await action;
    if (res.ok) {
      onSuccess();
      form.reset();
    } else {
      const err = await res.json().catch(() => ({}));
      toast.error(
        err?.error?.name?.[0] ||
          err?.error?.subject?.[0] ||
          err?.error?.body?.[0] ||
          err?.error?.message ||
          "Error saving campaign"
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
              <FormLabel>Campaign Name</FormLabel>
              <FormControl>
                <Input placeholder="Spring Sale" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Subject</FormLabel>
              <FormControl>
                <Input placeholder="Don't miss our big event!" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Body</FormLabel>
              <FormControl>
                <Textarea placeholder="Write your email body (HTML allowed)" rows={7} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Scheduling input can be added here for MVP */}
        <Button type="submit" className="w-full">
          {isEdit ? "Update Campaign" : "Create Campaign"}
        </Button>
      </form>
    </Form>
  );
}