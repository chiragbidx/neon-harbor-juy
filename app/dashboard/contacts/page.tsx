"use client";

import { useState, Suspense } from "react";
import { ContactsTable } from "@/components/dashboard/ContactsTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { ContactForm } from "@/components/dashboard/ContactForm";
import { toast } from "sonner";

export default function ContactsPage() {
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(0);

  function handleAddSuccess() {
    setOpen(false);
    setRefresh((r) => r + 1);
    toast.success("Contact saved successfully!");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Contacts</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button type="button">
              <PlusCircle className="mr-2" /> Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
            </DialogHeader>
            {/* Always mount a unique ContactForm for Add (not edit) */}
            {open && <ContactForm onSuccess={handleAddSuccess} />}
          </DialogContent>
        </Dialog>
      </div>
      <Suspense fallback={<div>Loading contacts...</div>}>
        <ContactsTable refreshKey={refresh} onRefresh={() => setRefresh(r => r + 1)} />
      </Suspense>
    </div>
  );
}