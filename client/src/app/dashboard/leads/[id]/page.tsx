"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import LeadActivity from "@/components/leads/LeadActivity";
import LeadAIInsight from "@/components/leads/LeadAIInsight";
import LeadDetailsSkeleton from "@/components/leads/LeadDetailsSkeleton";
import LeadNextAction from "@/components/leads/LeadNextAction";
import LeadProfile from "@/components/leads/LeadProfile";
import LeadRequirements from "@/components/leads/LeadRequirements";

import { getLeadById, type Lead } from "@/services/lead.service";

export default function LeadDetailsPage() {
  const params = useParams();

  const leadId = typeof params.id === "string" ? params.id : "";

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!leadId) {
      return;
    }

    const loadLead = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getLeadById(leadId);

        setLead(data);
      } catch (error) {
        console.error("Failed to load lead details:", error);

        setError("Unable to load this lead. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadLead();
  }, [leadId]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
        <LeadDetailsSkeleton />
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-7xl items-center justify-center px-6 py-8 sm:px-8 lg:px-10">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/10 text-danger">
            <span className="text-lg font-semibold">!</span>
          </div>

          <h1 className="mt-4 text-lg font-semibold text-foreground">
            Lead unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted">
            {error || "The requested lead could not be found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
      <LeadProfile lead={lead} />

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        <div className="space-y-6">
          <LeadAIInsight lead={lead} />
          <LeadRequirements lead={lead} />
        </div>

        <div className="space-y-6">
          <LeadNextAction lead={lead} />
          <LeadActivity lead={lead} />
        </div>
      </div>
    </div>
  );
}
