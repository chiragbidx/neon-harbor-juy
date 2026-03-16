"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCampaignAnalytics } from "./actions";
import { Loader2 } from "lucide-react";

export default function CampaignAnalyticsPage() {
  const params = useParams();
  const campaignId = Array.isArray(params.campaignId) ? params.campaignId[0] : params.campaignId;
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      const res = await fetch(`/api/campaigns/${campaignId}/analytics`);
      if (res.ok) setAnalytics(await res.json());
      else setAnalytics(null);
      setLoading(false);
    }
    if (campaignId) fetchAnalytics();
  }, [campaignId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="animate-spin mr-2" />
        Loading analytics...
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex justify-center items-center flex-col h-40">
        <div className="text-lg text-muted-foreground">No data for this campaign.</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Campaign Performance</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{analytics.campaign?.name ?? "Campaign details"}</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-8 flex-wrap">
          <Stat label="Delivered" value={analytics.delivered} />
          <Stat label="Opened" value={analytics.opened} />
          <Stat label="Clicked" value={analytics.clicked} />
        </CardContent>
      </Card>
      <div>
        <h2 className="text-xl font-semibold mb-2">Recipient Activity</h2>
        <table className="w-full bg-card rounded-lg border overflow-hidden">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left">Contact</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-center">Delivered</th>
              <th className="py-2 px-4 text-center">Opened</th>
              <th className="py-2 px-4 text-center">Clicked</th>
            </tr>
          </thead>
          <tbody>
            {analytics.recipients.length > 0 ? (
              analytics.recipients.map((r: any) => (
                <tr key={r.contactId} className="border-b">
                  <td className="py-2 px-4">{r.contactName}</td>
                  <td className="py-2 px-4">{r.contactEmail}</td>
                  <td className="py-2 px-4 text-center">{r.delivered ? "✔️" : ""}</td>
                  <td className="py-2 px-4 text-center">{r.opened ? "✔️" : ""}</td>
                  <td className="py-2 px-4 text-center">{r.clicked ? "✔️" : ""}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-6 text-center text-muted-foreground">
                  No recipient activity yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div className="px-6 py-2">
      <div className="text-2xl font-bold">{value ?? 0}</div>
      <div className="text-muted-foreground">{label}</div>
    </div>
  );
}