"use client";

import { Building2, Globe2, MapPin, BriefcaseBusiness } from "lucide-react";

export default function WorkspaceSettings() {
  return (
    <section className="mt-6 overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
      <div className="border-b border-border px-6 py-6 sm:px-7">
        <div>
          <p className="text-sm font-semibold text-primary">Workspace</p>

          <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Business profile
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Define the business context LeadFlow uses across leads, sales
            activity, reporting, and future automation.
          </p>
        </div>
      </div>

      <div className="grid gap-5 p-6 sm:p-7 md:grid-cols-2">
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
              defaultValue="Acme Properties"
              placeholder="Enter business name"
              className="h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-primary/10"
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
              defaultValue="real-estate"
              className="h-11 w-full appearance-none rounded-xl border border-border bg-surface pl-10 pr-4 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
            >
              <option value="real-estate">Real Estate</option>
              <option value="agency">Agency</option>
              <option value="education">Education</option>
              <option value="healthcare">Healthcare</option>
              <option value="financial-services">Financial Services</option>
              <option value="retail">Retail</option>
              <option value="technology">Technology</option>
              <option value="other">Other</option>
            </select>
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
              defaultValue="https://example.com"
              placeholder="https://yourbusiness.com"
              className="h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>
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
              defaultValue="Dhaka, Bangladesh"
              placeholder="City, country"
              className="h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-background/60 px-6 py-4 sm:px-7">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-medium text-muted">
            Business context helps personalize future lead qualification and
            automation.
          </p>

          <span className="text-xs font-semibold text-primary">
            Workspace active
          </span>
        </div>
      </div>
    </section>
  );
}
