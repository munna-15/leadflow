import AnalyticsHeader from "@/components/analytics/AnalyticsHeader";
import AnalyticsInsights from "@/components/analytics/AnalyticsInsights";
import AnalyticsOverview from "@/components/analytics/AnalyticsOverview";
import ConversionJourney from "@/components/analytics/ConversionJourney";
import LeadPerformance from "@/components/analytics/LeadPerformance";
import LeadSources from "@/components/analytics/LeadSources";

export default function AnalyticsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
      <AnalyticsHeader />

      <AnalyticsOverview />

      <ConversionJourney />

      <LeadSources />

      <LeadPerformance />

      <AnalyticsInsights />
    </div>
  );
}
