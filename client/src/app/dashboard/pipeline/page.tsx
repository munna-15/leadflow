"use client";

import { useEffect, useState } from "react";

import PipelineFlow from "@/components/pipeline/PipelineFlow";
import PipelineHeader from "@/components/pipeline/PipelineHeader";
import PipelineOverview from "@/components/pipeline/PipelineOverview";

import { getPipeline, type PipelineData } from "@/services/pipeline.service";

export default function PipelinePage() {
  const [pipeline, setPipeline] = useState<PipelineData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const loadPipeline = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPipeline();

      setPipeline(data);
    } catch (error) {
      console.error("Failed to load pipeline:", error);

      setError("Unable to load your pipeline. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPipeline();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
        <div className="animate-pulse space-y-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="h-4 w-32 rounded-full bg-border" />
              <div className="h-10 w-56 rounded-xl bg-border" />
              <div className="h-5 w-[420px] max-w-full rounded-lg bg-border" />
            </div>

            <div className="flex gap-2">
              <div className="h-11 w-24 rounded-xl bg-border" />
              <div className="h-11 w-28 rounded-xl bg-border" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-32 rounded-2xl bg-surface" />
            ))}
          </div>

          <div className="h-32 rounded-2xl bg-surface" />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="min-h-80 rounded-2xl bg-surface" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !pipeline) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-7xl items-center justify-center px-6 py-8 sm:px-8 lg:px-10">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/10 text-danger">
            <span className="text-lg font-semibold">!</span>
          </div>

          <h1 className="mt-4 text-lg font-semibold text-foreground">
            Pipeline unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted">
            {error || "Unable to load your pipeline right now."}
          </p>

          <button
            type="button"
            onClick={loadPipeline}
            className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-foreground px-4 text-sm font-semibold text-white transition-colors hover:bg-primary"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
      <PipelineHeader />

      <PipelineOverview summary={pipeline.summary} signals={pipeline.signals} />

      <PipelineFlow stages={pipeline.stages} outcomes={pipeline.outcomes} />
    </div>
  );
}
