"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CampaignForm } from "./CampaignForm";
import { toast } from "sonner";
import { PaperPlane, Trash2, Pencil, BarChart } from "lucide-react";
import Link from "next/link";

export function CampaignsTable({ refreshKey = 0 }: { refreshKey?: number }) {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [editingCampaign, setEditingCampaign] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchCampaigns() {
      const res = await fetch("/api/campaigns");
      if (res.ok) {
        setCampaigns(await res.json());
      } else {
        setCampaigns([]);
      }
    }
    fetchCampaigns();
  }, [refreshKey]);

  function handleEdit(campaign: any) {
    setEditingCampaign(campaign);
    setDialogOpen(true);
  }

  function handleSuccess() {
    setEditingCampaign(null);
    setDialogOpen(false);
    toast.success("Campaign updated!");
  }

  async function handleSend(campaign: any) {
    const res = await fetch(`/api/campaigns/${campaign.id}/send`, { method: "POST" });
    if (res.ok) {
      toast.success("Campaign sent!");
    } else {
      toast.error("Send failed.");
    }
  }

  async function handleDelete(campaign: any) {
    const res = await fetch(`/api/campaigns/${campaign.id}`, { method: "DELETE" });
    if (res.ok) {
      setCampaigns(campaigns.filter((c) => c.id !== campaign.id));
      toast.success("Deleted successfully!");
    } else {
      toast.error("Delete failed.");
    }
  }

  return (
    <div>
      <table className="w-full bg-card rounded-lg border overflow-hidden">
        <thead>
          <tr className="border-b">
            <th className="py-3 px-4 text-left">Name</th>
            <th className="py-3 px-4 text-left">Subject</th>
            <th className="py-3 px-4 text-left">Status</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <tr key={campaign.id} className="border-b hover:bg-accent/30">
                <td className="py-2 px-4">{campaign.name}</td>
                <td className="py-2 px-4">{campaign.subject}</td>
                <td className="py-2 px-4">
                  <span className={
                    campaign.status === "sent"
                      ? "text-emerald-700 dark:text-emerald-400 font-medium"
                      : campaign.status === "sending"
                      ? "text-primary font-medium"
                      : campaign.status === "failed"
                      ? "text-red-600 dark:text-red-400 font-medium"
                      : "text-muted-foreground"
                  }>
                    {campaign.status}
                  </span>
                </td>
                <td className="py-2 px-4 space-x-2 flex flex-row justify-center">
                  <Link href={`/dashboard/campaigns/${campaign.id}`}>
                    <Button variant="outline" size="sm">
                      <BarChart className="size-4 mr-1" />
                      Analytics
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(campaign)}>
                    <Pencil className="size-4" />
                  </Button>
                  {["draft", "scheduled"].includes(campaign.status) && (
                    <Button variant="default" size="sm" onClick={() => handleSend(campaign)}>
                      <PaperPlane className="size-4 mr-1" />
                      Send
                    </Button>
                  )}
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(campaign)}>
                    <Trash2 className="size-4" />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="p-8 text-xl text-center text-muted-foreground">
                No campaigns yet. Start by creating a new campaign to engage your audience!
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
          </DialogHeader>
          <CampaignForm campaign={editingCampaign} onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
}