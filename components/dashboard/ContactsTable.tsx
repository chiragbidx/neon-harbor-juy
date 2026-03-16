"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Pencil } from "lucide-react";
import { ContactForm } from "./ContactForm";
import { toast } from "sonner";

export function ContactsTable({ refreshKey = 0 }: { refreshKey?: number }) {
  const [contacts, setContacts] = useState<any[]>([]);
  const [editingContact, setEditingContact] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchContacts() {
      const res = await fetch("/api/contacts");
      if (res.ok) {
        setContacts(await res.json());
      } else {
        setContacts([]);
      }
    }
    fetchContacts();
  }, [refreshKey]);

  function handleEdit(contact: any) {
    setEditingContact(contact);
    setDialogOpen(true);
  }

  function handleSuccess() {
    setEditingContact(null);
    setDialogOpen(false);
    // trigger parent refresh by calling a callback or re-fetching
    toast.success("Contact updated!");
  }

  return (
    <div>
      <table className="w-full bg-card rounded-lg border overflow-hidden">
        <thead>
          <tr className="border-b">
            <th className="py-3 px-4 text-left">Name</th>
            <th className="py-3 px-4 text-left">Email</th>
            <th className="py-3 px-4 text-left">Tags</th>
            <th className="py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <tr key={contact.id} className="border-b hover:bg-accent/30">
                <td className="py-2 px-4">{contact.name}</td>
                <td className="py-2 px-4">{contact.email}</td>
                <td className="py-2 px-4">{(contact.tags || []).join(", ")}</td>
                <td className="py-2 px-4 space-x-2 flex justify-center">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(contact)}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={async () => {
                      // Optimistic UI; actual deletion via API/Action
                      const res = await fetch(`/api/contacts/${contact.id}`, { method: "DELETE" });
                      if (res.ok) {
                        toast.success("Contact deleted");
                        setContacts(contacts.filter((c) => c.id !== contact.id));
                      } else {
                        toast.error("Deletion failed");
                      }
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={4} className="p-8 text-xl text-center text-muted-foreground">No contacts found. Add your first contact to start building your audience!</td></tr>
          )}
        </tbody>
      </table>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
          </DialogHeader>
          <ContactForm contact={editingContact} onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
}