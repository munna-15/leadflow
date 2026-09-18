
"use client";

import {
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronDown,
  Globe2,
  LoaderCircle,
  MapPin,
  Save,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  getSettings,
  updateSettings,
  type WorkspaceSettings as WorkspaceSettingsData,
} from "@/services/settings.service";

const INDUSTRY_OPTIONS = [
  {
    value: "Real Estate",
    label: "Real Estate",
  },
  {
    value: "Agency",
    label: "Agency",
  },
  {
    value: "Education",
    label: "Education",
  },
  {
    value: "Healthcare",
    label: "Healthcare",
  },
  {
    value: "Financial Services",
    label: "Financial Services",
  },
  {
    value: "Retail",
    label: "Retail",
  },
  {
    value: "Technology",
    label: "Technology",
  },
  {
    value: "Other",
    label: "Other",
  },
];

export default function WorkspaceSettings() {
  const [workspace, setWorkspace] =
    useState<WorkspaceSettingsData | null>(null);

  const [businessName, setBusinessName] =
    useState("");

  const [industry, setIndustry] =
    useState("");

  const [website, setWebsite] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    let mounted = true;

    const loadWorkspace = async () => {
      try {
        setLoading(true);
        setError("");

        const settings = await getSettings();

        if (!mounted) {
          return;
        }

        setWorkspace(settings.workspace);

        setBusinessName(
          settings.workspace.name || "",
        );

        setIndustry(
          settings.workspace.industry || "",
        );

        setWebsite(
          settings.workspace.website || "",
        );

        setLocation(
          settings.workspace.location || "",
        );
      } catch (error) {
        if (!mounted) {
          return;
        }

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load workspace settings.",
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadWorkspace();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSave = async () => {
    if (!businessName.trim()) {
      setError("Business name is required.");
      setSuccess("");
      return;
    }

    if (!industry.trim()) {
      setError("Industry is required.");
      setSuccess("");
      return;
    }

    if (website.trim()) {
      try {
        new URL(website.trim());
      } catch {
        setError(
          "Please provide a valid website URL.",
        );
        setSuccess("");
        return;
      }
    }

    if (!location.trim()) {
      setError("Business location is required.");
      setSuccess("");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updatedSettings =
        await updateSettings({
          workspace: {
            name: businessName.trim(),
            industry: industry.trim(),
            website: website.trim()
              ? website.trim()
              : undefined,
            location: location.trim(),
          },
        });

      setWorkspace(
        updatedSettings.workspace,
      );

      setBusinessName(
        updatedSettings.workspace.name || "",
      );

      setIndustry(
        updatedSettings.workspace.industry || "",
      );

      setWebsite(
        updatedSettings.workspace.website || "",
      );

      setLocation(
        updatedSettings.workspace.location || "",
      );

      setSuccess(
        "Business profile updated successfully.",
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update workspace settings.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="mt-6 overflow-hidden rounded-3xl border border-border/80 bg-surface shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <div className="flex min-h-[360px] items-center justify-center">
          <div className="flex items-center gap-2 text-sm font-medium text-muted">
            <LoaderCircle className="h-4 w-4 animate-spin text-primary" />
            Loading workspace settings...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-6 overflow-hidden rounded-3xl border border-border/80 bg-surface shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
      <div className="border-b border-border/70 px-6 py-6 sm:px-7 sm:py-7">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <Building2 className="h-4 w-4" />
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Workspace
            </p>

            <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Business profile
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Define the business context LeadFlow uses across leads, sales
              activity, reporting, and future automation.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-7">
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {success}
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="business-name"
              className="text-sm font-semibold text-foreground"
            >
              Business name
            </label>

            <div className="relative mt-2">
              <Building2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

              <input
                id="business-name"
                type="text"
                value={businessName}
                onChange={(event) =>
                  setBusinessName(
                    event.target.value,
                  )
                }
                placeholder="Enter business name"
                disabled={saving}
                className="h-11 w-full rounded-xl border border-border/80 bg-surface pl-10 pr-4 text-sm text-foreground outline-none transition-colors duration-200 placeholder:text-muted hover:border-border focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="industry"
              className="text-sm font-semibold text-foreground"
            >
              Industry
            </label>

            <div className="relative mt-2">
              <BriefcaseBusiness className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

              <select
                id="industry"
                value={
                  INDUSTRY_OPTIONS.some(
                    (option) =>
                      option.value === industry,
                  )
                    ? industry
                    : "Other"
                }
                onChange={(event) =>
                  setIndustry(
                    event.target.value,
                  )
                }
                disabled={saving}
                className="h-11 w-full appearance-none rounded-xl border border-border/80 bg-surface pl-10 pr-10 text-sm text-foreground outline-none transition-colors duration-200 hover:border-border focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {INDUSTRY_OPTIONS.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ),
                )}
              </select>

              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            </div>
          </div>

          <div>
            <label
              htmlFor="website"
              className="text-sm font-semibold text-foreground"
            >
              Website
            </label>

            <div className="relative mt-2">
              <Globe2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

              <input
                id="website"
                type="url"
                value={website}
                onChange={(event) =>
                  setWebsite(
                    event.target.value,
                  )
                }
                placeholder="https://yourbusiness.com"
                disabled={saving}
                className="h-11 w-full rounded-xl border border-border/80 bg-surface pl-10 pr-4 text-sm text-foreground outline-none transition-colors duration-200 placeholder:text-muted hover:border-border focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <p className="mt-1.5 text-xs leading-5 text-muted">
              Optional. Include the full URL, such as
              https://yourbusiness.com.
            </p>
          </div>

          <div>
            <label
              htmlFor="location"
              className="text-sm font-semibold text-foreground"
            >
              Business location
            </label>

            <div className="relative mt-2">
              <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

              <input
                id="location"
                type="text"
                value={location}
                onChange={(event) =>
                  setLocation(
                    event.target.value,
                  )
                }
                placeholder="City, country"
                disabled={saving}
                className="h-11 w-full rounded-xl border border-border/80 bg-surface pl-10 pr-4 text-sm text-foreground outline-none transition-colors duration-200 placeholder:text-muted hover:border-border focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-border/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />

            <p className="max-w-2xl text-xs font-medium leading-5 text-muted">
              Business context helps personalize future lead qualification and
              automation.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}

            {saving
              ? "Saving..."
              : "Save changes"}
          </button>
        </div>

        {workspace && (
          <div className="mt-4 flex justify-end">
            <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-success" />

              <span className="text-xs font-semibold text-success">
                Workspace active
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

