"use client";

import { useEffect, useState } from "react";

import LeadsHeader from "@/components/leads/LeadsHeader";
import LeadStats from "@/components/leads/LeadStats";
import LeadList from "@/components/leads/LeadList";
import LeadCreateModal from "@/components/leads/LeadCreateModal";

import LeadsPageSkeleton from "@/components/leads/LeadsPageSkeleton";

import { getLeads, type Lead } from "@/services/lead.service";

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const loadLeads = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getLeads();

      setLeads(data);
    } catch (error) {
      console.error("Failed to load leads:", error);

      setError("Unable to load your leads. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleLeadCreated = (lead: Lead) => {
    setLeads((currentLeads) => [lead, ...currentLeads]);

    setIsCreateModalOpen(false);
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
        <LeadsPageSkeleton />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
      <LeadsHeader onAddLead={() => setIsCreateModalOpen(true)} />

      <LeadStats leads={leads} />

      <LeadList leads={leads} loading={false} error={error} />

      <LeadCreateModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={handleLeadCreated}
      />
    </div>
  );
}
