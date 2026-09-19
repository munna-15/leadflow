"use client";

import Link from "next/link";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Mail,
  MessageSquareText,
  Send,
  Sparkles,
} from "lucide-react";

import { motion } from "motion/react";

import SiteNavbar from "@/components/layout/SiteNavbar";
import SiteFooter from "@/components/home/SiteFooter";

import { submitGetStartedRequest } from "@/services/getStarted.service";

const businessTypes = [
  "Real estate",
  "Agency",
  "Clinic & healthcare",
  "Education",
  "Professional services",
  "E-commerce",
  "Other",
];

const teamSizes = [
  "Just me",
  "2–5 people",
  "6–15 people",
  "16–50 people",
  "50+ people",
];

const leadVolumes = [
  "Under 50 leads / month",
  "50–200 leads / month",
  "200–500 leads / month",
  "500–1,000 leads / month",
  "1,000+ leads / month",
];

const needs = [
  "Lead management",
  "AI qualification",
  "Lead scoring & intelligence",
  "Follow-up automation",
  "Website integration",
  "Custom workflow",
  "Website + LeadFlow system",
];

const steps = [
  {
    number: "01",
    title: "Tell us about your business",
    description:
      "Share a few details about your business, team and current lead workflow.",
  },
  {
    number: "02",
    title: "We understand your workflow",
    description:
      "We'll look at where leads enter, how your team follows up and where opportunities get lost.",
  },
  {
    number: "03",
    title: "We shape the right setup",
    description:
      "We'll recommend a LeadFlow setup based on what your business actually needs.",
  },
];

const initialForm = {
  name: "",
  businessName: "",
  email: "",
  businessType: "",
  website: "",
  teamSize: "",
  leadVolume: "",
  message: "",
};

function FieldLabel({
  children,
  required = false,
}: {
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="mb-2 block text-sm font-semibold text-foreground">
      {children}

      {required && <span className="ml-1 text-primary">*</span>}
    </label>
  );
}

function SelectField({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full appearance-none rounded-xl border border-border bg-white px-4 pr-10 text-sm text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
    </div>
  );
}

function getRequestErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "response" in error) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: unknown;
          };
        };
      }
    ).response;

    const message = response?.data?.message;

    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "We couldn't submit your request right now. Please try again.";
}

export default function GetStartedPage() {
  const [submitted, setSubmitted] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState(initialForm);

  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);

  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!submitted) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      successRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [submitted]);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (error) {
      setError(null);
    }
  };

  const toggleNeed = (need: string) => {
    setSelectedNeeds((current) =>
      current.includes(need)
        ? current.filter((item) => item !== need)
        : [...current, need],
    );

    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setError(null);

    const payload = {
      name: form.name.trim(),
      businessName: form.businessName.trim(),
      email: form.email.trim().toLowerCase(),
      businessType: form.businessType.trim(),
      website: form.website.trim(),
      teamSize: form.teamSize.trim(),
      leadVolume: form.leadVolume.trim(),
      needs: selectedNeeds,
      message: form.message.trim(),
    };

    try {
      setIsSubmitting(true);

      await submitGetStartedRequest(payload);

      setForm(initialForm);
      setSelectedNeeds([]);
      setSubmitted(true);
    } catch (requestError) {
      setError(getRequestErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <SiteNavbar />

      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-x-0 top-0 -z-10 h-[38rem] bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.10),transparent_58%)]" />

        <div className="mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8 lg:pb-24 lg:pt-24">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
              }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-semibold text-muted shadow-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Start a conversation
            </motion.div>

            <motion.h1
              initial={{
                opacity: 0,
                y: 16,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.55,
                delay: 0.05,
              }}
              className="mx-auto mt-7 max-w-5xl text-5xl font-semibold leading-[1.02] tracking-[-0.055em] text-foreground sm:text-6xl lg:text-7xl xl:text-[5.5rem]"
            >
              Let&apos;s build a clearer way to{" "}
              <span className="bg-gradient-to-r from-slate-950 via-slate-700 to-primary bg-clip-text text-transparent">
                manage your leads.
              </span>
            </motion.h1>

            <motion.p
              initial={{
                opacity: 0,
                y: 14,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.12,
              }}
              className="mx-auto mt-7 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8"
            >
              Tell us how your business currently handles leads, follow-ups and
              sales. We&apos;ll understand your workflow and help shape the
              right LeadFlow setup around it.
            </motion.p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <motion.aside
            initial={{
              opacity: 0,
              x: -20,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.55,
            }}
            className="lg:sticky lg:top-28"
          >
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Sparkles className="h-5 w-5" />
            </div>

            <h2 className="mt-6 max-w-md text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
              Start with your business, not a template.
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-muted sm:text-base">
              Every sales team works differently. The more we understand your
              workflow, the better we can shape LeadFlow around the way you
              actually operate.
            </p>

            <div className="mt-8 space-y-6">
              {steps.map((step) => (
                <div key={step.number} className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">
                    {step.number}
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {step.title}
                    </h3>

                    <p className="mt-1.5 text-sm leading-6 text-muted">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-9 rounded-2xl border border-border bg-white p-5 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.35)]">
              <div className="flex items-start gap-3">
                <MessageSquareText className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                <div>
                  <p className="text-sm font-semibold text-foreground">
                    No pressure. Just a conversation.
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted">
                    Share what you need. We&apos;ll help you understand what
                    makes sense for your business.
                  </p>
                </div>
              </div>
            </div>
          </motion.aside>

          <motion.div
            initial={{
              opacity: 0,
              y: 24,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 0.6,
            }}
            className="rounded-[1.5rem] border border-border bg-white p-6 shadow-[0_30px_80px_-55px_rgba(15,23,42,0.45)] sm:p-8 lg:p-10"
          >
            {submitted ? (
              <div
                ref={successRef}
                className="flex min-h-[38rem] scroll-mt-24 flex-col items-center justify-center text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <h2 className="mt-7 text-3xl font-semibold tracking-[-0.04em] text-foreground">
                  Thanks — we have your request.
                </h2>

                <p className="mt-4 max-w-md text-sm leading-7 text-muted">
                  We&apos;ll review your business needs and get back to you with
                  the next step.
                </p>

                <Link
                  href="/"
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
                >
                  Back to LeadFlow
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                    Tell us about your business
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-foreground sm:text-3xl">
                    Let&apos;s understand what you need.
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-muted">
                    A few details are enough to start the conversation.
                  </p>
                </div>

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <div>
                    <FieldLabel required>Your name</FieldLabel>

                    <input
                      required
                      value={form.name}
                      onChange={(event) =>
                        updateField("name", event.target.value)
                      }
                      placeholder="Your full name"
                      className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-foreground outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                  </div>

                  <div>
                    <FieldLabel required>Business name</FieldLabel>

                    <input
                      required
                      value={form.businessName}
                      onChange={(event) =>
                        updateField("businessName", event.target.value)
                      }
                      placeholder="Your business"
                      className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-foreground outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                  </div>

                  <div>
                    <FieldLabel required>Work email</FieldLabel>

                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(event) =>
                        updateField("email", event.target.value)
                      }
                      placeholder="you@company.com"
                      className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-foreground outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                  </div>

                  <div>
                    <FieldLabel>Business type</FieldLabel>

                    <SelectField
                      value={form.businessType}
                      onChange={(value) => updateField("businessType", value)}
                      options={businessTypes}
                      placeholder="Select business type"
                    />
                  </div>

                  <div>
                    <FieldLabel>Current website</FieldLabel>

                    <input
                      type="url"
                      value={form.website}
                      onChange={(event) =>
                        updateField("website", event.target.value)
                      }
                      placeholder="https://yourwebsite.com"
                      className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-foreground outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                  </div>

                  <div>
                    <FieldLabel>Team size</FieldLabel>

                    <SelectField
                      value={form.teamSize}
                      onChange={(value) => updateField("teamSize", value)}
                      options={teamSizes}
                      placeholder="Select team size"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <FieldLabel>Approximate monthly lead volume</FieldLabel>

                    <SelectField
                      value={form.leadVolume}
                      onChange={(value) => updateField("leadVolume", value)}
                      options={leadVolumes}
                      placeholder="Select lead volume"
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <FieldLabel>What are you looking for?</FieldLabel>

                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {needs.map((need) => {
                      const selected = selectedNeeds.includes(need);

                      return (
                        <button
                          key={need}
                          type="button"
                          onClick={() => toggleNeed(need)}
                          aria-pressed={selected}
                          className={`flex min-h-12 items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                            selected
                              ? "border-primary/40 bg-primary-soft text-primary-dark"
                              : "border-border bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <span>{need}</span>

                          {selected && (
                            <CheckCircle2 className="h-4 w-4 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-8">
                  <FieldLabel required>Tell us about your situation</FieldLabel>

                  <textarea
                    required
                    value={form.message}
                    onChange={(event) =>
                      updateField("message", event.target.value)
                    }
                    placeholder="What are you currently struggling with? How do leads come in today, and what would you like LeadFlow to improve?"
                    rows={6}
                    className="w-full resize-none rounded-xl border border-border bg-white px-4 py-3.5 text-sm leading-6 text-foreground outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </div>

                {error && (
                  <div
                    role="alert"
                    className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

                    <p className="leading-6">{error}</p>
                  </div>
                )}

                <div className="mt-8 flex flex-col gap-4 border-t border-border pt-7 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-2.5">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted" />

                    <p className="max-w-xs text-xs leading-5 text-muted">
                      Your information is used only to understand your request
                      and discuss the right LeadFlow setup.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-white shadow-[0_12px_35px_-12px_rgba(14,165,233,0.6)] transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending request...
                      </>
                    ) : (
                      <>
                        Request a consultation
                        <Send className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
