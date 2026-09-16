
import LeadActivity from "@/components/leads/LeadActivity";
import LeadAIInsight from "@/components/leads/LeadAIInsight";
import LeadNextAction from "@/components/leads/LeadNextAction";
import LeadProfile from "@/components/leads/LeadProfile";
import LeadRequirements from "@/components/leads/LeadRequirements";

export default function LeadDetailsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
      <LeadProfile />

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        <div className="space-y-6">
          <LeadAIInsight />
          <LeadRequirements />
        </div>

        <div className="space-y-6">
          <LeadNextAction />
          <LeadActivity />
        </div>
      </div>
    </div>
  );
}

