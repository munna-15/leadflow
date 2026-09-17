"use client";

import {
  CalendarDays,
  Check,
  ChevronDown,
  Mail,
  Phone,
  Plus,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";

import { FormEvent, useEffect, useState } from "react";

import {
  createLead,
  type Lead,
  type LeadStatus,
  type LeadTemperature,
} from "@/services/lead.service";

type LeadCreateModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: (lead: Lead) => void;
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  source: string;
  status: LeadStatus;
  temperature: LeadTemperature;
  nextFollowUpAt: string;
};

const initialForm: FormState = {
  name: "",
  email: "",
  phone: "",
  source: "website",
  status: "new",
  temperature: "cold",
  nextFollowUpAt: "",
};

const statusOptions: {
  value: LeadStatus;
  label: string;
}[] = [
  { value: "new", label: "New" },
  { value: "qualified", label: "Qualified" },
  { value: "contacted", label: "Contacted" },
  { value: "meeting", label: "Meeting" },
  { value: "negotiation", label: "Negotiation" },
];

const temperatureOptions: {
  value: LeadTemperature;
  label: string;
}[] = [
  { value: "cold", label: "Cold" },
  { value: "warm", label: "Warm" },
  { value: "hot", label: "Hot" },
];

const sourceOptions = [
  "website",
  "facebook",
  "whatsapp",
  "email",
  "phone",
  "referral",
  "manual",
];

const temperatureStyles = {
  cold: {
    dot: "bg-slate-400",
    active: "border-slate-300 bg-slate-50 text-slate-700",
  },
  warm: {
    dot: "bg-amber-400",
    active: "border-amber-200 bg-amber-50 text-amber-700",
  },
  hot: {
    dot: "bg-orange-500",
    active: "border-orange-200 bg-orange-50 text-orange-700",
  },
};

export default function LeadCreateModal({
  open,
  onClose,
  onCreated,
}: LeadCreateModalProps) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setForm(initialForm);
    setFormError("");
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose, submitting]);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) {
    return null;
  }

  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (formError) {
      setFormError("");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = form.name.trim();

    if (!name) {
      setFormError("Please enter the lead's name.");
      return;
    }

    if (name.length < 2) {
      setFormError("Lead name must be at least 2 characters.");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");

      const lead = await createLead({
        name,
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        source: form.source,
        status: form.status,
        temperature: form.temperature,
        nextFollowUpAt: form.nextFollowUpAt
          ? new Date(form.nextFollowUpAt).toISOString()
          : null,
      });

      onCreated(lead);
    } catch (error: any) {
      console.error("Failed to create lead:", error);

      const message =
        error?.response?.data?.message ||
        "Unable to create this lead. Please try again.";

      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-lead-title"
    >
      <button
        type="button"
        aria-label="Close modal"
        onClick={() => {
          if (!submitting) {
            onClose();
          }
        }}
        className="absolute inset-0 cursor-default bg-[#0f172a]/45 backdrop-blur-sm"
      />

      <div className="relative z-10 flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl sm:max-h-[calc(100vh-3rem)]">
        <div className="relative border-b border-border px-5 py-5 sm:px-7 sm:py-6">
          <div
            aria-hidden="true"
            className="absolute right-0 top-0 h-32 w-48 bg-gradient-to-bl from-primary/10 via-primary/5 to-transparent blur-2xl"
          />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Plus className="h-4.5 w-4.5" />
                </span>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                    Lead management
                  </p>

                  <h2
                    id="create-lead-title"
                    className="mt-0.5 text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
                  >
                    Add a new lead
                  </h2>
                </div>
              </div>

              <p className="mt-3 max-w-lg text-sm leading-6 text-muted">
                Capture the essential information now. LeadFlow can enrich and
                qualify the lead as it moves through your workflow.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!submitting) {
                  onClose();
                }
              }}
              disabled={submitting}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-muted transition-colors hover:bg-background hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="min-h-0 overflow-y-auto">
          <div className="space-y-7 px-5 py-6 sm:px-7 sm:py-7">
            {formError && (
              <div
                role="alert"
                className="rounded-2xl border border-danger/20 bg-danger/5 px-4 py-3.5"
              >
                <p className="text-sm font-medium text-danger">{formError}</p>
              </div>
            )}

            <section>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background text-muted">
                  <UserRound className="h-4 w-4" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Contact information
                  </h3>
                  <p className="text-xs text-muted">
                    Basic information about the opportunity.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="lead-name"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Lead name
                    <span className="ml-1 text-danger">*</span>
                  </label>

                  <div className="relative">
                    <UserRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

                    <input
                      id="lead-name"
                      type="text"
                      value={form.name}
                      onChange={(event) =>
                        updateField("name", event.target.value)
                      }
                      placeholder="e.g. Rahim Ahmed"
                      autoFocus
                      disabled={submitting}
                      className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted/60 focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="lead-email"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Email
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

                    <input
                      id="lead-email"
                      type="email"
                      value={form.email}
                      onChange={(event) =>
                        updateField("email", event.target.value)
                      }
                      placeholder="rahim@example.com"
                      disabled={submitting}
                      className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted/60 focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="lead-phone"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Phone
                  </label>

                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

                    <input
                      id="lead-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(event) =>
                        updateField("phone", event.target.value)
                      }
                      placeholder="01712345678"
                      disabled={submitting}
                      className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted/60 focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background text-muted">
                  <Sparkles className="h-4 w-4" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Lead context
                  </h3>
                  <p className="text-xs text-muted">
                    Set the initial state of this opportunity.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="lead-source"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Source
                  </label>

                  <div className="relative">
                    <select
                      id="lead-source"
                      value={form.source}
                      onChange={(event) =>
                        updateField("source", event.target.value)
                      }
                      disabled={submitting}
                      className="h-11 w-full appearance-none rounded-xl border border-border bg-background px-4 pr-10 text-sm capitalize text-foreground outline-none transition-all focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {sourceOptions.map((source) => (
                        <option key={source} value={source}>
                          {source}
                        </option>
                      ))}
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="lead-status"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Initial status
                  </label>

                  <div className="relative">
                    <select
                      id="lead-status"
                      value={form.status}
                      onChange={(event) =>
                        updateField("status", event.target.value as LeadStatus)
                      }
                      disabled={submitting}
                      className="h-11 w-full appearance-none rounded-xl border border-border bg-background px-4 pr-10 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-2.5 block text-sm font-medium text-foreground">
                  Lead temperature
                </label>

                <div className="grid grid-cols-3 gap-2.5">
                  {temperatureOptions.map((option) => {
                    const isActive = form.temperature === option.value;

                    const styles = temperatureStyles[option.value];

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateField("temperature", option.value)}
                        disabled={submitting}
                        className={`flex h-11 items-center justify-center gap-2 rounded-xl border text-sm font-semibold capitalize transition-all ${
                          isActive
                            ? styles.active
                            : "border-border bg-background text-muted hover:border-primary/30 hover:bg-primary-soft/40 hover:text-foreground"
                        } disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${styles.dot}`}
                        />

                        {option.label}

                        {isActive && <Check className="h-3.5 w-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background text-muted">
                  <CalendarDays className="h-4 w-4" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Follow-up
                  </h3>
                  <p className="text-xs text-muted">
                    Never lose track of the next conversation.
                  </p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="lead-follow-up"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Next follow-up
                </label>

                <input
                  id="lead-follow-up"
                  type="datetime-local"
                  value={form.nextFollowUpAt}
                  onChange={(event) =>
                    updateField("nextFollowUpAt", event.target.value)
                  }
                  disabled={submitting}
                  className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <p className="mt-2 text-xs leading-5 text-muted">
                  Optional. Set a time when this lead should come back to your
                  attention.
                </p>
              </div>
            </section>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-border bg-background/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-7">
            <button
              type="button"
              onClick={() => {
                if (!submitting) {
                  onClose();
                }
              }}
              disabled={submitting}
              className="h-11 rounded-xl px-5 text-sm font-semibold text-muted transition-colors hover:bg-surface hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#111827] px-5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating...
                </>
              ) : (
                <>
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary">
                    <Plus className="h-3.5 w-3.5" />
                  </span>
                  Create lead
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
