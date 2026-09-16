
import PipelineFlow from "@/components/pipeline/PipelineFlow";
import PipelineHeader from "@/components/pipeline/PipelineHeader";
import PipelineOverview from "@/components/pipeline/PipelineOverview";

export default function PipelinePage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
      <PipelineHeader />
      <PipelineOverview />
      <PipelineFlow />
    </div>
  );
}

