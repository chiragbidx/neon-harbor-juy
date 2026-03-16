"use client";

import { useEffect, useState, Suspense } from "react";
import { ContactsTable } from "@/components/dashboard/ContactsTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getContacts } from "./actions";
import { PlusCircle } from "lucide-react";
import { ContactForm } from "@/components/dashboard/ContactForm";
import { toast } from "sonner";

export default function ContactsPage() {
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(0);

  function handleSuccess() {
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
            <Button>
              <PlusCircle className="mr-2" /> Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
            </DialogHeader>
            <ContactForm onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>
      <Suspense fallback={<div>Loading contacts...</div>}>
        <ContactsTable refreshKey={refresh} />
      </Suspense>
    </div>
  );
}