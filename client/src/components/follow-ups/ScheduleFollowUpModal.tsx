"use client";

import {
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Mail,
  MessageSquare,
  Phone,
  Search,
  UsersRound,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

import {
  createFollowUp,
  updateFollowUp,
  type FollowUp,
  type FollowUpType,
} from "@/services/followUp.service";
import { getLeads, type Lead } from "@/services/lead.service";

type ScheduleFollowUpModalProps = {
  open: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  followUp?: FollowUp | null;
  onCreated?: () => void;
  onUpdated?: () => void;
};

type FollowUpTypeOption = {
  value: FollowUpType;
  label: string;
  icon: typeof Phone;
};

const followUpTypes: FollowUpTypeOption[] = [
  {
    value: "call",
    label: "Call",
    icon: Phone,
  },
  {
    value: "message",
    label: "Message",
    icon: MessageSquare,
  },
  {
    value: "email",
    label: "Email",
    icon: Mail,
  },
  {
    value: "meeting",
    label: "Meeting",
    icon: UsersRound,
  },
  {
    value: "other",
    label: "Other",
    icon: CalendarDays,
  },
];

const getDefaultDateTime = () => {
  const date = new Date();

  date.setMinutes(date.getMinutes() + 30);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return {
    date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(date.getDate()).padStart(2, "0")}`,
    time: `${String(date.getHours()).padStart(
      2,
      "0",
    )}:${String(date.getMinutes()).padStart(2, "0")}`,
  };
};

const getTodayDate = () => {
  const date = new Date();

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

const formatScheduledAt = (date: string, time: string) => {
  if (!date || !time) {
    return null;
  }

  const localDate = new Date(`${date}T${time}:00`);

  if (Number.isNaN(localDate.getTime())) {
    return null;
  }

  return localDate.toISOString();
};

const getLeadInitials = (name: string) => {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return initials || "?";
};

const getLeadContact = (lead: Lead) => {
  return lead.email ?? lead.phone ?? "No contact details";
};

const getDateParts = (scheduledAt: string) => {
  const date = new Date(scheduledAt);

  if (Number.isNaN(date.getTime())) {
    return getDefaultDateTime();
  }

  return {
    date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(date.getDate()).padStart(2, "0")}`,
    time: `${String(date.getHours()).padStart(
      2,
      "0",
    )}:${String(date.getMinutes()).padStart(2, "0")}`,
  };
};

export default function ScheduleFollowUpModal({
  open,
  onClose,
  mode = "create",
  followUp = null,
  onCreated,
  onUpdated,
}: ScheduleFollowUpModalProps) {
  const isEditMode = mode === "edit";

  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);

  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [leadSearch, setLeadSearch] = useState("");
  const [leadDropdownOpen, setLeadDropdownOpen] = useState(false);

  const [type, setType] = useState<FollowUpType>("call");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const leadSearchRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const selectedLead = useMemo(() => {
    return leads.find((lead) => lead._id === selectedLeadId) ?? null;
  }, [leads, selectedLeadId]);

  const filteredLeads = useMemo(() => {
    const search = leadSearch.trim().toLowerCase();

    const availableLeads = leads.filter((lead) => lead._id !== selectedLeadId);

    if (!search) {
      return availableLeads;
    }

    return availableLeads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(search) ||
        lead.email?.toLowerCase().includes(search) ||
        lead.phone?.toLowerCase().includes(search),
    );
  }, [leads, leadSearch, selectedLeadId]);

  const hasSearchResults = filteredLeads.length > 0;

  const isDateToday = date === getTodayDate();

  const isPastTime =
    isDateToday &&
    Boolean(time) &&
    new Date(`${date}T${time}:00`).getTime() <= Date.now();

  useEffect(() => {
    if (!open) {
      return;
    }

    if (isEditMode && followUp) {
      const dateParts = getDateParts(followUp.scheduledAt);

      setSelectedLeadId(followUp.lead._id);
      setType(followUp.type);
      setDate(dateParts.date);
      setTime(dateParts.time);
      setNotes(followUp.notes ?? "");
      setLeadSearch("");
      setLeadDropdownOpen(false);
      setError("");

      return;
    }

    const defaults = getDefaultDateTime();

    setSelectedLeadId("");
    setLeadSearch("");
    setLeadDropdownOpen(false);
    setType("call");
    setDate(defaults.date);
    setTime(defaults.time);
    setNotes("");
    setError("");
  }, [open, isEditMode, followUp]);

  useEffect(() => {
    if (!open) {
      return;
    }

    let mounted = true;

    const loadLeads = async () => {
      try {
        setLeadsLoading(true);

        const data = await getLeads();

        if (!mounted) {
          return;
        }

        setLeads(data);
      } catch (error) {
        console.error("Failed to load leads:", error);

        if (mounted) {
          setError("Unable to load your leads. Please try again.");
        }
      } finally {
        if (mounted) {
          setLeadsLoading(false);
        }
      }
    };

    loadLeads();

    return () => {
      mounted = false;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (leadSearchRef.current && !leadSearchRef.current.contains(target)) {
        setLeadDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      if (leadDropdownOpen) {
        setLeadDropdownOpen(false);
        return;
      }

      if (!submitting) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, leadDropdownOpen, submitting, onClose]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    requestAnimationFrame(() => {
      modalRef.current?.focus();
    });
  }, [open]);

  if (!open) {
    return null;
  }

  const handleLeadSelect = (lead: Lead) => {
    setSelectedLeadId(lead._id);
    setLeadSearch("");
    setLeadDropdownOpen(false);
    setError("");
  };

  const handleLeadRemove = () => {
    if (isEditMode) {
      return;
    }

    setSelectedLeadId("");
    setLeadSearch("");
    setLeadDropdownOpen(false);
    setError("");
  };

  const handleDateChange = (value: string) => {
    setDate(value);
    setError("");

    if (value !== getTodayDate()) {
      return;
    }

    if (time && new Date(`${value}T${time}:00`).getTime() <= Date.now()) {
      const defaults = getDefaultDateTime();

      setTime(defaults.time);
    }
  };

  const handleTimeChange = (value: string) => {
    setTime(value);
    setError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    setError("");

    if (!selectedLeadId) {
      setError("Please select a lead.");
      return;
    }

    const scheduledAt = formatScheduledAt(date, time);

    if (!scheduledAt) {
      setError("Please select a valid date and time.");
      return;
    }

    if (new Date(scheduledAt).getTime() <= Date.now()) {
      setError("Please choose a future date and time.");
      return;
    }

    try {
      setSubmitting(true);

      if (isEditMode && followUp) {
        await updateFollowUp(followUp._id, {
          type,
          scheduledAt,
          notes: notes.trim() || null,
        });

        onUpdated?.();
      } else {
        await createFollowUp({
          lead: selectedLeadId,
          type,
          scheduledAt,
          notes: notes.trim() || null,
        });

        onCreated?.();
      }

      onClose();
    } catch (error) {
      console.error(
        isEditMode
          ? "Failed to update follow-up:"
          : "Failed to create follow-up:",
        error,
      );

      setError(
        isEditMode
          ? "Unable to update follow-up. Please try again."
          : "Unable to schedule follow-up. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const title = isEditMode ? "Update follow-up" : "Schedule a conversation";

  const description = isEditMode
    ? "Adjust the next touchpoint and keep the opportunity moving."
    : "Set the next touchpoint and keep the opportunity moving.";

  const eyebrow = isEditMode ? "Edit follow-up" : "Sales follow-up";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1220]/40 p-3 backdrop-blur-[4px] sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !submitting) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule-follow-up-title"
        tabIndex={-1}
        className="flex max-h-[calc(100vh-24px)] w-full max-w-2xl flex-col overflow-hidden rounded-[28px] border border-border bg-surface shadow-[0_30px_100px_rgba(15,23,42,0.2)] outline-none sm:max-h-[calc(100vh-48px)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between px-6 pb-5 pt-6 sm:px-8 sm:pb-6 sm:pt-7">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-soft text-primary">
                {isEditMode ? (
                  <Clock3 className="h-4 w-4" />
                ) : (
                  <CalendarDays className="h-4 w-4" />
                )}
              </span>

              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                {eyebrow}
              </span>
            </div>

            <h2
              id="schedule-follow-up-title"
              className="mt-3 text-[26px] font-semibold leading-tight tracking-[-0.035em] text-foreground sm:text-[28px]"
            >
              {title}
            </h2>

            <p className="mt-1.5 text-sm leading-5 text-muted">{description}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close follow-up modal"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-muted transition-colors hover:bg-background hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 overflow-y-auto"
        >
          <div className="space-y-7 px-6 py-6 sm:px-8 sm:py-7">
            <section>
              <div className="mb-3.5">
                <p className="text-sm font-semibold text-foreground">Lead</p>

                <p className="mt-1 text-xs leading-5 text-muted">
                  {isEditMode
                    ? "This follow-up is linked to the selected lead."
                    : "Select the person you want to follow up with."}
                </p>
              </div>

              <div ref={leadSearchRef} className="relative">
                {selectedLead ? (
                  <div className="flex min-h-[58px] items-center gap-3 rounded-2xl border border-primary/20 bg-primary-soft/40 px-3.5 py-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#111827] text-[11px] font-semibold text-white">
                      {getLeadInitials(selectedLead.name)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 items-center gap-2">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {selectedLead.name}
                        </p>

                        <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold capitalize text-primary shadow-sm">
                          {selectedLead.temperature}
                        </span>
                      </div>

                      <p className="mt-0.5 truncate text-xs text-muted">
                        {getLeadContact(selectedLead)}
                      </p>
                    </div>

                    {!isEditMode && (
                      <button
                        type="button"
                        onClick={handleLeadRemove}
                        disabled={submitting}
                        aria-label="Remove selected lead"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-white hover:text-danger disabled:pointer-events-none disabled:opacity-50"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <div
                      className={`flex h-12 items-center rounded-xl border bg-background transition-all ${
                        leadDropdownOpen
                          ? "border-primary bg-surface ring-4 ring-primary/10"
                          : "border-border"
                      }`}
                    >
                      <Search className="ml-4 h-4 w-4 shrink-0 text-muted" />

                      <input
                        type="text"
                        value={leadSearch}
                        onChange={(event) => {
                          setLeadSearch(event.target.value);
                          setLeadDropdownOpen(true);
                          setError("");
                        }}
                        onFocus={() => setLeadDropdownOpen(true)}
                        placeholder={
                          leadsLoading
                            ? "Loading leads..."
                            : "Search by name, email or phone"
                        }
                        disabled={leadsLoading || submitting}
                        autoComplete="off"
                        className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-60"
                      />

                      <ChevronDown
                        className={`mr-4 h-4 w-4 shrink-0 text-muted transition-transform duration-200 ${
                          leadDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>

                    {leadDropdownOpen && (
                      <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_20px_50px_rgba(15,23,42,0.14)]">
                        <div className="border-b border-border px-4 py-2.5">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                            {leadSearch.trim()
                              ? "Search results"
                              : "Your leads"}
                          </p>
                        </div>

                        <div className="max-h-56 overflow-y-auto p-1.5">
                          {leadsLoading ? (
                            <div className="space-y-1">
                              {[1, 2, 3].map((item) => (
                                <div
                                  key={item}
                                  className="flex items-center gap-3 rounded-xl px-3 py-3"
                                >
                                  <div className="h-9 w-9 animate-pulse rounded-xl bg-border" />

                                  <div className="min-w-0 flex-1 space-y-2">
                                    <div className="h-3.5 w-32 animate-pulse rounded bg-border" />
                                    <div className="h-3 w-44 animate-pulse rounded bg-border" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : hasSearchResults ? (
                            filteredLeads.map((lead) => (
                              <button
                                key={lead._id}
                                type="button"
                                onClick={() => handleLeadSelect(lead)}
                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-background"
                              >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#111827] text-[11px] font-semibold text-white">
                                  {getLeadInitials(lead.name)}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-semibold text-foreground">
                                    {lead.name}
                                  </p>

                                  <p className="mt-0.5 truncate text-xs text-muted">
                                    {getLeadContact(lead)}
                                  </p>
                                </div>

                                <span className="shrink-0 rounded-full bg-primary-soft px-2 py-1 text-[10px] font-semibold capitalize text-primary">
                                  {lead.temperature}
                                </span>
                              </button>
                            ))
                          ) : (
                            <div className="px-5 py-8 text-center">
                              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-background text-muted">
                                <Search className="h-4 w-4" />
                              </div>

                              <p className="mt-3 text-sm font-semibold text-foreground">
                                No leads found
                              </p>

                              <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-muted">
                                Try searching with a different name, email or
                                phone number.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </section>

            <section>
              <div className="mb-3.5">
                <p className="text-sm font-semibold text-foreground">
                  Follow-up method
                </p>

                <p className="mt-1 text-xs leading-5 text-muted">
                  Choose how the conversation will happen.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {followUpTypes.map((item) => {
                  const Icon = item.icon;
                  const selected = type === item.value;

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setType(item.value)}
                      disabled={submitting}
                      className={`flex h-12 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-60 ${
                        selected
                          ? "bg-primary text-white shadow-sm"
                          : "border border-border bg-background text-body hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />

                      <span className="leading-none">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <div className="mb-3.5">
                <p className="text-sm font-semibold text-foreground">
                  Schedule
                </p>

                <p className="mt-1 text-xs leading-5 text-muted">
                  Choose a future date and time for the follow-up.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="follow-up-date"
                    className="mb-1.5 block text-xs font-medium text-body"
                  >
                    Date
                  </label>

                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

                    <input
                      id="follow-up-date"
                      type="date"
                      value={date}
                      min={getTodayDate()}
                      onChange={(event) => handleDateChange(event.target.value)}
                      disabled={submitting}
                      required
                      className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="follow-up-time"
                    className="mb-1.5 block text-xs font-medium text-body"
                  >
                    Time
                  </label>

                  <div className="relative">
                    <Clock3 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

                    <input
                      id="follow-up-time"
                      type="time"
                      value={time}
                      min={
                        isDateToday
                          ? new Date().toTimeString().slice(0, 5)
                          : undefined
                      }
                      onChange={(event) => handleTimeChange(event.target.value)}
                      disabled={submitting}
                      required
                      className={`h-11 w-full rounded-xl border bg-background pl-10 pr-3 text-sm text-foreground outline-none transition-all focus:bg-surface focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60 ${
                        isPastTime
                          ? "border-danger focus:border-danger focus:ring-danger/10"
                          : "border-border focus:border-primary"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="mb-3.5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">Notes</p>

                  <p className="mt-1 text-xs leading-5 text-muted">
                    Add useful context for the next conversation.
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-background px-2.5 py-1 text-[10px] font-medium text-muted">
                  Optional
                </span>
              </div>

              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                disabled={submitting}
                placeholder="e.g. Confirm requirements, discuss pricing and agree on the next step."
                rows={3}
                maxLength={2000}
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none transition-all placeholder:text-muted focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <div className="mt-1.5 flex justify-end">
                <span className="text-[10px] text-muted">
                  {notes.length}/2000
                </span>
              </div>
            </section>

            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-danger/10 bg-danger/5 px-4 py-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-danger/10 text-danger">
                  <X className="h-3 w-3" />
                </div>

                <p className="text-sm leading-5 text-danger">{error}</p>
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center justify-between gap-4 border-t border-border bg-surface px-6 py-4 sm:px-8">
            <div className="hidden min-w-0 sm:block">
              {selectedLead ? (
                <p className="truncate text-xs text-muted">
                  {isEditMode ? "Updating " : "Scheduling for "}

                  <span className="font-semibold text-foreground">
                    {selectedLead.name}
                  </span>
                </p>
              ) : (
                <p className="text-xs text-muted">Select a lead to continue.</p>
              )}
            </div>

            <div className="ml-auto flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="h-10 rounded-lg px-4 text-sm font-semibold text-muted transition-colors hover:bg-background hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  submitting ||
                  leadsLoading ||
                  !selectedLeadId ||
                  !date ||
                  !time
                }
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#111827] px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                    <span>{isEditMode ? "Updating..." : "Scheduling..."}</span>
                  </>
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5 shrink-0" />

                    <span>
                      {isEditMode ? "Save changes" : "Schedule follow-up"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
