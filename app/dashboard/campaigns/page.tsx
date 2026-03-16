"use client";

import { useState, Suspense } from "react";
import { CampaignsTable } from "@/components/dashboard/CampaignsTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { CampaignForm } from "@/components/dashboard/CampaignForm";
import { toast } from "sonner";

export default function CampaignsPage() {
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(0);

  function handleAddSuccess() {
    setOpen(false);
    setRefresh((r) => r + 1);
    toast.success("Campaign saved!");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Campaigns</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button type="button">
              <PlusCircle className="mr-2" /> New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Campaign</DialogTitle>
            </DialogHeader>
            {open && <CampaignForm onSuccess={handleAddSuccess} />}
          </DialogContent>
        </Dialog>
      </div>
      <Suspense fallback={<div>Loading campaigns...</div>}>
        <CampaignsTable refreshKey={refresh} onRefresh={() => setRefresh(r => r + 1)} />
      </Suspense>
    </div>
  );
}