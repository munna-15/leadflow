"use client";

import { useCallback, useEffect, useState } from "react";

import FollowUpActivity from "@/components/follow-ups/FollowUpActivity";
import FollowUpQueue from "@/components/follow-ups/FollowUpQueue";
import FollowUpsHeader from "@/components/follow-ups/FollowUpsHeader";
import FollowUpsOverview from "@/components/follow-ups/FollowUpsOverview";
import ScheduleFollowUpModal from "@/components/follow-ups/ScheduleFollowUpModal";

import { getFollowUps, type FollowUp } from "@/services/followUp.service";

export default function FollowUpsPage() {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activityRefreshKey, setActivityRefreshKey] = useState(0);
  const [editingFollowUpId, setEditingFollowUpId] = useState<string | null>(
    null,
  );
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  const loadFollowUps = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getFollowUps();

      setFollowUps(data);
    } catch (error) {
      console.error("Failed to load follow-ups:", error);
      setError("Unable to load your follow-ups. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFollowUps();
  }, [loadFollowUps]);

  const handleSchedule = useCallback(() => {
    setEditingFollowUpId(null);
    setScheduleModalOpen(true);
  }, []);

  const handleEditFollowUp = useCallback((followUpId: string) => {
    setEditingFollowUpId(followUpId);
    setScheduleModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setScheduleModalOpen(false);
    setEditingFollowUpId(null);
  }, []);

  const handleFollowUpCompleted = useCallback(
    async (followUpId: string) => {
      setFollowUps((current) =>
        current.map((followUp) =>
          followUp._id === followUpId
            ? {
                ...followUp,
                status: "completed",
                completedAt: new Date().toISOString(),
              }
            : followUp,
        ),
      );

      setActivityRefreshKey((current) => current + 1);

      await loadFollowUps();
    },
    [loadFollowUps],
  );

  const handleFollowUpDeleted = useCallback(
    async (followUpId: string) => {
      setFollowUps((current) =>
        current.filter((followUp) => followUp._id !== followUpId),
      );

      await loadFollowUps();
    },
    [loadFollowUps],
  );

  const handleFollowUpCreated = useCallback(async () => {
    await loadFollowUps();

    setActivityRefreshKey((current) => current + 1);
  }, [loadFollowUps]);

  const handleFollowUpUpdated = useCallback(async () => {
    await loadFollowUps();

    setActivityRefreshKey((current) => current + 1);

    setScheduleModalOpen(false);
    setEditingFollowUpId(null);
  }, [loadFollowUps]);

  const editingFollowUp = editingFollowUpId
    ? (followUps.find((followUp) => followUp._id === editingFollowUpId) ?? null)
    : null;

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
        <div className="animate-pulse space-y-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="h-4 w-32 rounded-full bg-border" />
              <div className="h-10 w-56 rounded-xl bg-border" />
              <div className="h-5 w-[460px] max-w-full rounded-lg bg-border" />
            </div>

            <div className="h-11 w-40 rounded-xl bg-border" />
          </div>

          <div className="h-48 rounded-3xl bg-surface" />

          <div className="h-96 rounded-3xl bg-surface" />

          <div className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
            <div className="h-64 rounded-3xl bg-surface" />
            <div className="h-64 rounded-3xl bg-surface" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-7xl items-center justify-center px-6 py-8 sm:px-8 lg:px-10">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/10 text-danger">
            <span className="text-lg font-semibold">!</span>
          </div>

          <h1 className="mt-4 text-lg font-semibold text-foreground">
            Follow-ups unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted">{error}</p>

          <button
            type="button"
            onClick={loadFollowUps}
            className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-foreground px-4 text-sm font-semibold text-white transition-colors hover:bg-primary"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
        <FollowUpsHeader onSchedule={handleSchedule} />

        <FollowUpsOverview followUps={followUps} />

        <FollowUpQueue
          followUps={followUps}
          onCompleted={handleFollowUpCompleted}
          onDeleted={handleFollowUpDeleted}
          onEdit={handleEditFollowUp}
        />

        <div className="mt-10 grid gap-6 xl:grid-cols-[1.45fr_1fr]">
          <div className="rounded-3xl border border-border bg-foreground p-6 text-white shadow-sm sm:p-7">
            <p className="text-sm font-semibold text-sky-300">
              Follow-up discipline
            </p>

            <h2 className="mt-2 max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">
              Consistent follow-up keeps good opportunities alive.
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              LeadFlow brings overdue conversations, today&apos;s actions, and
              upcoming meetings into one focused workspace so your team knows
              what deserves attention next.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-slate-300">
              <span>Capture</span>
              <span className="text-sky-400">→</span>
              <span>Qualify</span>
              <span className="text-sky-400">→</span>
              <span>Follow up</span>
              <span className="text-sky-400">→</span>
              <span>Convert</span>
            </div>
          </div>

          <FollowUpActivity refreshKey={activityRefreshKey} />
        </div>
      </div>

      <ScheduleFollowUpModal
        open={scheduleModalOpen}
        onClose={handleModalClose}
        mode={editingFollowUp ? "edit" : "create"}
        followUp={editingFollowUp}
        onCreated={handleFollowUpCreated}
        onUpdated={handleFollowUpUpdated}
      />
    </>
  );
}
