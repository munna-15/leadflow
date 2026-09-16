import LeadsHeader from "@/components/leads/LeadsHeader";
import LeadStats from "@/components/leads/LeadStats";
import LeadList from "@/components/leads/LeadList";

export default function LeadsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
      <LeadsHeader />
      <LeadStats />
      <LeadList />
    </div>
  );
}
