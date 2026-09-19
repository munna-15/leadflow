"use client";

import Link from "next/link";
import {
  Archive,
  ArrowUpRight,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Clipboard,
  Globe2,
  Mail,
  MapPin,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import {
  type FormEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";

import {
  createClientWorkspace,
  deleteClientWorkspace,
  getClientWorkspaces,
  resendClientInvitation,
  updateClientWorkspace,
  type ClientWorkspace,
  type CreateClientWorkspacePayload,
  type UpdateClientWorkspacePayload,
} from "@/services/clientOnboarding.service";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

type FormState = {
  name: string;
  email: string;
  businessName: string;
  industry: string;
  website: string;
  location: string;
};

type InvitationState = "active" | "pending" | "expired" | "neutral";

type ActionMenuState = string | null;

type ModalMode = "edit" | "archive" | null;

/* -------------------------------------------------------------------------- */
/* CONSTANTS                                                                  */
/* -------------------------------------------------------------------------- */

const initialForm: FormState = {
  name: "",
  email: "",
  businessName: "",
  industry: "",
  website: "",
  location: "",
};

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

const normalizeWebsite = (value: string) => {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `https://${trimmed}`;
};

const formatDate = (value: string | null | undefined) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

const getWebsiteLabel = (website: string | null) => {
  if (!website) {
    return null;
  }

  try {
    return new URL(website).hostname.replace(/^www\./, "");
  } catch {
    return website
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\/$/, "");
  }
};

const getInvitationState = (
  client: ClientWorkspace,
): {
  label: string;
  tone: InvitationState;
} => {
  if (client.owner?.isActive) {
    return {
      label: "Active",
      tone: "active",
    };
  }

  if (!client.invitation) {
    return {
      label: "No invitation",
      tone: "neutral",
    };
  }

  if (client.invitation.status === "accepted") {
    return {
      label: "Activated",
      tone: "active",
    };
  }

  if (client.invitation.status === "revoked") {
    return {
      label: "Revoked",
      tone: "neutral",
    };
  }

  if (new Date(client.invitation.expiresAt).getTime() <= Date.now()) {
    return {
      label: "Expired",
      tone: "expired",
    };
  }

  return {
    label: "Pending",
    tone: "pending",
  };
};

const statusClasses: Record<InvitationState, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
  pending: "bg-sky-50 text-sky-700 ring-sky-600/10",
  expired: "bg-amber-50 text-amber-700 ring-amber-600/10",
  neutral: "bg-slate-100 text-slate-600 ring-slate-500/10",
};

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function PlatformClientsPage() {
  const [clients, setClients] = useState<ClientWorkspace[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [form, setForm] = useState<FormState>(initialForm);

  const [isCreating, setIsCreating] = useState(false);

  const [resendingBusinessId, setResendingBusinessId] = useState<string | null>(
    null,
  );

  const [search, setSearch] = useState("");

  const [latestInviteUrl, setLatestInviteUrl] = useState<string | null>(null);

  const [copiedInvite, setCopiedInvite] = useState(false);

  const [editingClient, setEditingClient] = useState<ClientWorkspace | null>(
    null,
  );

  const [archivingClient, setArchivingClient] =
    useState<ClientWorkspace | null>(null);

  const [actionMenu, setActionMenu] = useState<ActionMenuState>(null);

  const [isUpdating, setIsUpdating] = useState(false);

  const [isArchiving, setIsArchiving] = useState(false);

  /* ------------------------------------------------------------------------ */
  /* MODAL STATE                                                              */
  /* ------------------------------------------------------------------------ */

  const modalMode: ModalMode = editingClient
    ? "edit"
    : archivingClient
      ? "archive"
      : null;

  const modalOpen = modalMode !== null;

  /* ------------------------------------------------------------------------ */
  /* BODY SCROLL LOCK                                                         */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!modalOpen) {
      return;
    }

    const body = document.body;

    const previousOverflow = body.style.overflow;

    body.style.overflow = "hidden";

    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [modalOpen]);

  /* ------------------------------------------------------------------------ */
  /* ESCAPE                                                                   */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!modalOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      if (isUpdating || isArchiving) {
        return;
      }

      setEditingClient(null);
      setArchivingClient(null);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [modalOpen, isUpdating, isArchiving]);

  /* ------------------------------------------------------------------------ */
  /* LOAD CLIENTS                                                             */
  /* ------------------------------------------------------------------------ */

  const loadClients = useCallback(async (background = false) => {
    try {
      if (background) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const data = await getClientWorkspaces();

      setClients(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to load client workspaces.";

      toast.error(message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadClients();
  }, [loadClients]);

  /* ------------------------------------------------------------------------ */
  /* SEARCH                                                                   */
  /* ------------------------------------------------------------------------ */

  const filteredClients = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return clients;
    }

    return clients.filter((client) => {
      const values = [
        client.name,
        client.industry,
        client.location,
        client.owner?.name,
        client.owner?.email,
        client.website,
      ];

      return values.some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(normalizedSearch),
      );
    });
  }, [clients, search]);

  /* ------------------------------------------------------------------------ */
  /* CREATE FORM                                                              */
  /* ------------------------------------------------------------------------ */

  const updateForm = (field: keyof FormState, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /* ------------------------------------------------------------------------ */
  /* CREATE CLIENT                                                            */
  /* ------------------------------------------------------------------------ */

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: CreateClientWorkspacePayload = {
      name: form.name.trim(),
      email: form.email.trim(),
      businessName: form.businessName.trim(),
      industry: form.industry.trim(),
      website: normalizeWebsite(form.website),
      location: form.location.trim(),
    };

    if (!payload.name || !payload.email || !payload.businessName) {
      toast.error("Client name, email and business name are required.");
      return;
    }

    try {
      setIsCreating(true);

      const result = await createClientWorkspace(payload);

      setForm(initialForm);

      await loadClients(true);

      setLatestInviteUrl(result.invitation.devInviteUrl || null);

      setIsCreateOpen(false);

      if (result.invitation.emailSent) {
        toast.success("Client workspace created and invitation sent.");
      } else {
        toast.warning(
          "Workspace created, but the invitation email could not be delivered.",
        );
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to create client workspace.";

      toast.error(message);
    } finally {
      setIsCreating(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* RESEND INVITATION                                                        */
  /* ------------------------------------------------------------------------ */

  const handleResend = async (businessId: string) => {
    try {
      setResendingBusinessId(businessId);

      setActionMenu(null);

      const result = await resendClientInvitation(businessId);

      await loadClients(true);

      setLatestInviteUrl(result.invitation.devInviteUrl || null);

      if (result.invitation.emailSent) {
        toast.success("A new invitation has been sent.");
      } else {
        toast.warning(
          "A new invitation was created, but email delivery is unavailable.",
        );
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to resend invitation.";

      toast.error(message);
    } finally {
      setResendingBusinessId(null);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* UPDATE CLIENT                                                            */
  /* ------------------------------------------------------------------------ */

  const handleUpdate = async (payload: UpdateClientWorkspacePayload) => {
    if (!editingClient) {
      return;
    }

    try {
      setIsUpdating(true);

      const result = await updateClientWorkspace(editingClient.id, payload);

      setClients((current) =>
        current.map((client) => {
          if (client.id !== editingClient.id) {
            return client;
          }

          return {
            ...client,
            name: result.business.name,
            industry: result.business.industry,
            website: result.business.website,
            location: result.business.location,
            isActive: result.business.isActive,
            owner: client.owner
              ? {
                  ...client.owner,
                  name: result.client.name,
                }
              : null,
            invitation: result.invitation,
          };
        }),
      );

      setEditingClient(null);

      toast.success("Client workspace updated successfully.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to update client workspace.";

      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* ARCHIVE CLIENT                                                           */
  /* ------------------------------------------------------------------------ */

  const handleArchive = async () => {
    if (!archivingClient) {
      return;
    }

    try {
      setIsArchiving(true);

      await deleteClientWorkspace(archivingClient.id);

      setClients((current) =>
        current.filter((client) => client.id !== archivingClient.id),
      );

      setArchivingClient(null);

      toast.success("Client workspace archived and access revoked.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to archive client workspace.";

      toast.error(message);
    } finally {
      setIsArchiving(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* DELETE ACTION                                                            */
  /* ------------------------------------------------------------------------ */

  const handlePermanentDeleteNotice = () => {
    setActionMenu(null);

    toast.info(
      "Permanent deletion is not enabled. Archive the workspace to revoke access while preserving its history.",
    );
  };

  /* ------------------------------------------------------------------------ */
  /* COPY INVITE                                                              */
  /* ------------------------------------------------------------------------ */

  const handleCopyInvite = async () => {
    if (!latestInviteUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(latestInviteUrl);

      setCopiedInvite(true);

      window.setTimeout(() => {
        setCopiedInvite(false);
      }, 1800);
    } catch {
      toast.error("Unable to copy the invitation link.");
    }
  };

  /* ------------------------------------------------------------------------ */
  /* CLOSE MENUS                                                              */
  /* ------------------------------------------------------------------------ */

  const closeActionMenu = () => {
    setActionMenu(null);
  };

  return (
    <main className="min-h-screen bg-[#F7F8FA]">
      <div
        className="mx-auto w-full max-w-[1480px] px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10"
        onClick={(event) => {
          const target = event.target as HTMLElement;

          if (!target.closest("[data-action-menu]")) {
            closeActionMenu();
          }
        }}
      >
        {/* ------------------------------------------------------------------ */}
        {/* HERO                                                               */}
        {/* ------------------------------------------------------------------ */}

        <section className="relative overflow-hidden rounded-[2rem] border border-[#E5E7EB] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.05)]">
          <div className="pointer-events-none absolute right-[-10%] top-[-48%] h-[540px] w-[540px] rounded-full bg-sky-100/70 blur-[110px]" />

          <div className="pointer-events-none absolute bottom-[-42%] left-[24%] h-[360px] w-[360px] rounded-full bg-cyan-50/70 blur-[100px]" />

          <div className="relative px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-11">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-4xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.17em] text-sky-700">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Client operations
                </div>

                <h1 className="mt-5 text-4xl font-semibold leading-[1.03] tracking-[-0.065em] text-[#0F172A] sm:text-5xl lg:text-[4.1rem]">
                  One place for every
                  <span className="block bg-gradient-to-r from-[#111827] via-[#334155] to-[#0EA5E9] bg-clip-text text-transparent">
                    client workspace.
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-[#64748B] sm:text-base">
                  Create workspaces, manage client access, control invitations
                  and keep every relationship operationally accounted for.
                </p>
              </div>

              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center lg:flex-col lg:items-end">
                <div className="flex items-center gap-3 border-l border-[#E5E7EB] pl-5 sm:pl-6">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#94A3B8]">
                      Workspace access
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#111827]">
                      Business isolated
                    </p>
                  </div>

                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>

                <button
                  type="button"
                  onClick={() => setIsCreateOpen((current) => !current)}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#111827] px-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(15,23,42,0.14)] transition-all duration-200 hover:bg-[#1F2937] hover:shadow-[0_16px_36px_rgba(15,23,42,0.18)]"
                >
                  {isCreateOpen ? (
                    <>
                      <X className="h-4 w-4" />
                      Close form
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Add client
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* CREATE WORKSPACE                                                   */}
        {/* ------------------------------------------------------------------ */}

        <AnimatePresence initial={false}>
          {isCreateOpen && (
            <motion.section
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              transition={{
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="overflow-hidden"
            >
              <div className="mt-5 overflow-hidden rounded-[1.9rem] border border-sky-100 bg-white shadow-[0_20px_70px_rgba(14,165,233,0.05)]">
                <div className="border-b border-[#EEF2F7] bg-gradient-to-r from-white via-sky-50/40 to-white px-6 py-6 sm:px-8">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                      <Sparkles className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-sky-700">
                        Workspace onboarding
                      </p>

                      <h2 className="mt-1 text-xl font-semibold tracking-[-0.035em] text-[#111827] sm:text-2xl">
                        Create a client workspace
                      </h2>

                      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">
                        Create the workspace and send a secure invitation. The
                        client activates their account independently.
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleCreate} className="p-6 sm:p-8">
                  <div className="grid gap-x-5 gap-y-6 lg:grid-cols-2">
                    {[
                      {
                        id: "client-name",
                        label: "Client name",
                        value: form.name,
                        field: "name" as const,
                        placeholder: "Omar Rahman",
                        icon: UserRound,
                        type: "text",
                      },
                      {
                        id: "client-email",
                        label: "Client email",
                        value: form.email,
                        field: "email" as const,
                        placeholder: "omar@globalfoods.com",
                        icon: Mail,
                        type: "email",
                      },
                      {
                        id: "business-name",
                        label: "Business name",
                        value: form.businessName,
                        field: "businessName" as const,
                        placeholder: "Global Foods",
                        icon: Building2,
                        type: "text",
                      },
                      {
                        id: "industry",
                        label: "Industry",
                        value: form.industry,
                        field: "industry" as const,
                        placeholder: "Restaurant",
                        icon: null,
                        type: "text",
                      },
                      {
                        id: "website",
                        label: "Website",
                        value: form.website,
                        field: "website" as const,
                        placeholder: "globalfoods.com",
                        icon: Globe2,
                        type: "text",
                      },
                      {
                        id: "location",
                        label: "Location",
                        value: form.location,
                        field: "location" as const,
                        placeholder: "Dhaka",
                        icon: MapPin,
                        type: "text",
                      },
                    ].map((field) => {
                      const FieldIcon = field.icon;

                      return (
                        <div key={field.id}>
                          <label
                            htmlFor={field.id}
                            className="mb-2 block text-sm font-medium text-[#374151]"
                          >
                            {field.label}
                          </label>

                          <div className="relative">
                            {FieldIcon ? (
                              <FieldIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                            ) : null}

                            <input
                              id={field.id}
                              type={field.type}
                              value={field.value}
                              onChange={(event) =>
                                updateForm(field.field, event.target.value)
                              }
                              placeholder={field.placeholder}
                              autoComplete={
                                field.field === "name"
                                  ? "name"
                                  : field.field === "email"
                                    ? "email"
                                    : "off"
                              }
                              className={`h-12 w-full rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#111827] outline-none transition-all duration-200 placeholder:text-[#A1A1AA] hover:border-[#CBD5E1] focus:border-[#7DD3FC] focus:ring-4 focus:ring-[#E0F2FE] ${
                                FieldIcon ? "pl-10 pr-4" : "px-4"
                              }`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-7 flex flex-col gap-4 border-t border-[#EEF2F7] pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-xl text-xs leading-5 text-[#94A3B8]">
                      Invitations expire after 7 days. Clients create their own
                      password during activation.
                    </p>

                    <button
                      type="submit"
                      disabled={isCreating}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#111827] px-5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#1F2937] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isCreating ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Creating workspace
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Create workspace
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ------------------------------------------------------------------ */}
        {/* DEVELOPMENT INVITATION                                             */}
        {/* ------------------------------------------------------------------ */}

        <AnimatePresence>
          {latestInviteUrl && (
            <motion.section
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -4,
              }}
              className="mt-5 overflow-hidden rounded-[1.5rem] border border-sky-100 bg-sky-50/70"
            >
              <div className="flex flex-col gap-4 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-sky-700" />

                    <p className="text-sm font-semibold text-[#111827]">
                      Development invitation ready
                    </p>
                  </div>

                  <p className="mt-1 text-xs leading-5 text-[#64748B]">
                    This development-only URL is exposed because development
                    invitation URL access is enabled.
                  </p>

                  <p className="mt-3 break-all rounded-xl border border-sky-100 bg-white px-4 py-3 text-xs text-sky-700">
                    {latestInviteUrl}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyInvite}
                  className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-sky-200 bg-white px-4 text-sm font-semibold text-sky-700 transition-colors hover:bg-sky-50"
                >
                  {copiedInvite ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Clipboard className="h-4 w-4" />
                      Copy link
                    </>
                  )}
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ------------------------------------------------------------------ */}
        {/* DIRECTORY                                                           */}
        {/* ------------------------------------------------------------------ */}

        <section className="mt-10">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-gradient-to-r from-[#0EA5E9] to-transparent" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.17em] text-sky-700">
                  Workspace directory
                </span>
              </div>

              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.045em] text-[#111827] sm:text-3xl">
                Manage every client relationship.
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">
                Edit workspace details, monitor access and control invitation
                lifecycle from one operational directory.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search client, owner or location"
                  className="h-11 w-full rounded-xl border border-[#E5E7EB] bg-white pl-10 pr-10 text-sm text-[#111827] outline-none transition-all duration-200 placeholder:text-[#A1A1AA] hover:border-[#CBD5E1] focus:border-[#7DD3FC] focus:ring-4 focus:ring-[#E0F2FE] sm:w-[330px]"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-[#94A3B8] transition-colors hover:bg-[#F1F5F9] hover:text-[#475569]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => void loadClients(true)}
                disabled={isRefreshing}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm font-semibold text-[#374151] transition-all duration-200 hover:border-[#CBD5E1] hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  className={isRefreshing ? "h-4 w-4 animate-spin" : "h-4 w-4"}
                />
                Refresh
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-y border-[#E5E7EB] py-4">
            <div className="flex items-center gap-4">
              <p className="text-xs font-medium text-[#64748B]">
                {isLoading
                  ? "Loading workspaces..."
                  : `${filteredClients.length} workspace${
                      filteredClients.length === 1 ? "" : "s"
                    }`}
              </p>

              {search && !isLoading && (
                <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-semibold text-sky-700">
                  Filtered
                </span>
              )}
            </div>

            <span className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8]">
              <ShieldCheck className="h-3.5 w-3.5 text-sky-600" />
              Secure workspace access
            </span>
          </div>

          <div className="mt-5">
            {isLoading ? (
              <LoadingDirectory />
            ) : filteredClients.length === 0 ? (
              <EmptyDirectory
                search={search}
                onCreate={() => setIsCreateOpen(true)}
              />
            ) : (
              <section className="overflow-visible rounded-[1.9rem] border border-[#E5E7EB] bg-white shadow-[0_20px_65px_rgba(15,23,42,0.045)]">
                <div className="hidden grid-cols-[minmax(260px,1.5fr)_minmax(210px,1.1fr)_minmax(120px,.8fr)_minmax(170px,1fr)_80px] gap-5 border-b border-[#E5E7EB] bg-[#FBFCFE] px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#94A3B8] md:grid lg:px-8">
                  <span>Workspace</span>

                  <span>Owner</span>

                  <span>Access</span>

                  <span>Invitation</span>

                  <span className="text-right">Actions</span>
                </div>

                <div className="divide-y divide-[#EEF2F7]">
                  {filteredClients.map((client) => {
                    const state = getInvitationState(client);

                    const websiteLabel = getWebsiteLabel(client.website);

                    const canResend = client.owner?.isActive === false;

                    const isResending = resendingBusinessId === client.id;

                    const isMenuOpen = actionMenu === client.id;

                    return (
                      <div
                        key={client.id}
                        className="group relative px-5 py-5 transition-colors duration-200 hover:bg-[#FCFDFE] sm:px-6 lg:px-8"
                      >
                        <div className="grid gap-5 md:grid-cols-[minmax(260px,1.5fr)_minmax(210px,1.1fr)_minmax(120px,.8fr)_minmax(170px,1fr)_80px] md:items-center md:gap-5">
                          {/* Workspace */}
                          <div className="min-w-0">
                            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A1A1AA] md:hidden">
                              Workspace
                            </p>

                            <div className="flex items-start gap-3.5">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                                <Building2 className="h-[18px] w-[18px]" />
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <h3 className="truncate text-sm font-semibold tracking-[-0.015em] text-[#111827]">
                                    {client.name}
                                  </h3>

                                  <ChevronRight className="hidden h-3.5 w-3.5 text-[#CBD5E1] sm:block" />
                                </div>

                                <p className="mt-1 text-xs text-[#64748B]">
                                  {client.industry || "Industry not set"}
                                </p>

                                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-[#94A3B8]">
                                  {client.location && (
                                    <span className="inline-flex items-center gap-1.5">
                                      <MapPin className="h-3 w-3" />
                                      {client.location}
                                    </span>
                                  )}

                                  {websiteLabel && (
                                    <a
                                      href={client.website || "#"}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1.5 transition-colors hover:text-sky-700"
                                    >
                                      <Globe2 className="h-3 w-3" />
                                      {websiteLabel}
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Owner */}
                          <div className="min-w-0">
                            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A1A1AA] md:hidden">
                              Owner
                            </p>

                            {client.owner ? (
                              <>
                                <p className="truncate text-sm font-medium text-[#374151]">
                                  {client.owner.name}
                                </p>

                                <p className="mt-1 truncate text-xs text-[#64748B]">
                                  {client.owner.email}
                                </p>
                              </>
                            ) : (
                              <p className="text-sm text-[#A1A1AA]">No owner</p>
                            )}
                          </div>

                          {/* Access */}
                          <div>
                            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A1A1AA] md:hidden">
                              Access
                            </p>

                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold ring-1 ${statusClasses[state.tone]}`}
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-current" />

                              {state.label}
                            </span>
                          </div>

                          {/* Invitation */}
                          <div className="min-w-0">
                            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A1A1AA] md:hidden">
                              Invitation
                            </p>

                            {client.invitation ? (
                              <>
                                <p className="text-xs font-medium text-[#374151]">
                                  {client.invitation.status === "accepted"
                                    ? "Accepted"
                                    : client.invitation.status === "revoked"
                                      ? "Revoked"
                                      : state.tone === "expired"
                                        ? "Expired"
                                        : "Pending"}
                                </p>

                                <p className="mt-1 text-xs text-[#94A3B8]">
                                  {client.invitation.status === "accepted"
                                    ? client.invitation.acceptedAt
                                      ? `Activated ${formatDate(
                                          client.invitation.acceptedAt,
                                        )}`
                                      : "Activated"
                                    : `Expires ${formatDate(
                                        client.invitation.expiresAt,
                                      )}`}
                                </p>
                              </>
                            ) : (
                              <span className="text-xs text-[#A1A1AA]">
                                No invitation
                              </span>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="relative flex items-center justify-start md:justify-end">
                            <p className="mr-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A1A1AA] md:hidden">
                              Actions
                            </p>

                            <WorkspaceActionMenu
                              clientId={client.id}
                              clientName={client.name}
                              canResend={canResend}
                              isResending={isResending}
                              isOpen={isMenuOpen}
                              onToggle={() =>
                                setActionMenu(isMenuOpen ? null : client.id)
                              }
                              onEdit={() => {
                                setActionMenu(null);

                                setEditingClient(client);
                              }}
                              onArchive={() => {
                                setActionMenu(null);

                                setArchivingClient(client);
                              }}
                              onResend={() => void handleResend(client.id)}
                              onDeleteNotice={handlePermanentDeleteNotice}
                            />
                          </div>
                        </div>

                        {/* Mobile footer */}
                        <div className="mt-4 flex items-center justify-between border-t border-[#F8FAFC] pt-4 md:hidden">
                          <span className="text-xs text-[#A1A1AA]">
                            Workspace created{" "}
                            {formatDate(client.invitation?.createdAt || null)}
                          </span>

                          {client.owner?.isActive && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                              <Check className="h-3.5 w-3.5" />
                              Active
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-[#E5E7EB] bg-[#FBFCFE] px-5 py-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col gap-2 text-xs text-[#94A3B8] sm:flex-row sm:items-center sm:justify-between">
                    <span>
                      Showing{" "}
                      <span className="font-semibold text-[#64748B]">
                        {filteredClients.length}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-[#64748B]">
                        {clients.length}
                      </span>{" "}
                      workspaces
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-sky-600" />
                      Business-isolated access
                    </span>
                  </div>
                </div>
              </section>
            )}
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* FOOTER                                                             */}
        {/* ------------------------------------------------------------------ */}

        <section className="mt-6 flex flex-col gap-3 border-t border-[#E5E7EB] pt-5 text-xs text-[#94A3B8] sm:flex-row sm:items-center sm:justify-between">
          <span>LeadFlow / Client Operations</span>

          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Workspace operations operational
          </span>
        </section>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* EDIT MODAL                                                           */}
      {/* -------------------------------------------------------------------- */}

      <AnimatePresence>
        {editingClient && (
          <EditClientModal
            client={editingClient}
            isUpdating={isUpdating}
            onClose={() => {
              if (!isUpdating) {
                setEditingClient(null);
              }
            }}
            onSubmit={handleUpdate}
            onArchive={() => {
              if (isUpdating) {
                return;
              }

              const client = editingClient;

              setEditingClient(null);

              setArchivingClient(client);
            }}
          />
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------------------- */}
      {/* ARCHIVE MODAL                                                        */}
      {/* -------------------------------------------------------------------- */}

      <AnimatePresence>
        {archivingClient && (
          <ArchiveClientModal
            client={archivingClient}
            isArchiving={isArchiving}
            onClose={() => {
              if (!isArchiving) {
                setArchivingClient(null);
              }
            }}
            onConfirm={() => void handleArchive()}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* WORKSPACE ACTION MENU                                                      */
/* -------------------------------------------------------------------------- */

function WorkspaceActionMenu({
  clientId,
  clientName,
  canResend,
  isResending,
  isOpen,
  onToggle,
  onEdit,
  onArchive,
  onResend,
  onDeleteNotice,
}: {
  clientId: string;
  clientName: string;
  canResend: boolean;
  isResending: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onArchive: () => void;
  onResend: () => void;
  onDeleteNotice: () => void;
}) {
  const triggerRef = useRef<HTMLButtonElement>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;

    const menu = menuRef.current;

    if (!trigger || !menu) {
      return;
    }

    const triggerRect = trigger.getBoundingClientRect();

    const menuRect = menu.getBoundingClientRect();

    const viewportPadding = 12;
    const gap = 10;

    const spaceAbove = triggerRect.top - viewportPadding;

    const spaceBelow =
      window.innerHeight - triggerRect.bottom - viewportPadding;

    const shouldOpenAbove =
      spaceBelow < menuRect.height + gap && spaceAbove >= menuRect.height + gap;

    let top = shouldOpenAbove
      ? triggerRect.top - menuRect.height - gap
      : triggerRect.bottom + gap;

    let left = triggerRect.right - menuRect.width;

    const maxLeft = window.innerWidth - menuRect.width - viewportPadding;

    left = Math.max(viewportPadding, Math.min(left, maxLeft));

    const maxTop = window.innerHeight - menuRect.height - viewportPadding;

    top = Math.max(viewportPadding, Math.min(top, maxTop));

    setPosition({
      top,
      left,
    });
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    updatePosition();

    const handleViewportChange = () => {
      updatePosition();
    };

    window.addEventListener("resize", handleViewportChange);

    window.addEventListener("scroll", handleViewportChange, true);

    return () => {
      window.removeEventListener("resize", handleViewportChange);

      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [isOpen, canResend, updatePosition]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onToggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onToggle]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={`Actions for ${clientName}`}
        aria-expanded={isOpen}
        aria-controls={isOpen ? `workspace-actions-${clientId}` : undefined}
        onClick={(event) => {
          event.stopPropagation();
          onToggle();
        }}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#64748B] transition-all duration-200 hover:border-[#CBD5E1] hover:bg-[#F8FAFC] hover:text-[#111827]"
      >
        {isResending ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : (
          <MoreHorizontal className="h-4 w-4" />
        )}
      </button>

      {mounted &&
        isOpen &&
        createPortal(
          <motion.div
            ref={menuRef}
            id={`workspace-actions-${clientId}`}
            initial={{
              opacity: 0,
              scale: 0.97,
              y: 4,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.97,
              y: 4,
            }}
            transition={{
              duration: 0.14,
              ease: [0.22, 1, 0.36, 1],
            }}
            data-action-menu
            onClick={(event) => event.stopPropagation()}
            style={{
              position: "fixed",
              top: position.top,
              left: position.left,
            }}
            className="z-[9999] w-56 origin-bottom-right overflow-hidden rounded-xl border border-[#E5E7EB] bg-white p-1.5 shadow-[0_24px_70px_rgba(15,23,42,0.16)]"
          >
            <div className="px-2.5 pb-1.5 pt-1">
              <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#A1A1AA]">
                Workspace actions
              </p>
            </div>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onEdit();
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-[#374151] transition-colors hover:bg-[#F8FAFC]"
            >
              <Pencil className="h-3.5 w-3.5 text-[#64748B]" />
              Edit workspace
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onArchive();
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-[#374151] transition-colors hover:bg-[#F8FAFC]"
            >
              <Archive className="h-3.5 w-3.5 text-amber-600" />
              Archive workspace
            </button>

            {canResend && (
              <button
                type="button"
                disabled={isResending}
                onClick={(event) => {
                  event.stopPropagation();
                  onResend();
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-[#374151] transition-colors hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Mail className="h-3.5 w-3.5 text-sky-600" />
                Resend invitation
              </button>
            )}

            <div className="my-1 border-t border-[#EEF2F7]" />

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onDeleteNotice();
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete workspace
            </button>
          </motion.div>,
          document.body,
        )}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* MODAL PORTAL                                                               */
/* -------------------------------------------------------------------------- */

function ModalPortal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(children, document.body);
}

/* -------------------------------------------------------------------------- */
/* EDIT CLIENT MODAL                                                          */
/* -------------------------------------------------------------------------- */

function EditClientModal({
  client,
  isUpdating,
  onClose,
  onSubmit,
  onArchive,
}: {
  client: ClientWorkspace;
  isUpdating: boolean;
  onClose: () => void;
  onSubmit: (payload: UpdateClientWorkspacePayload) => Promise<void>;
  onArchive: () => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const [form, setForm] = useState({
    name: client.owner?.name || client.name,
    businessName: client.name,
    industry: client.industry || "",
    website: client.website || "",
    location: client.location || "",
  });

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = form.name.trim();

    const businessName = form.businessName.trim();

    if (!name || !businessName) {
      toast.error("Client name and business name are required.");
      return;
    }

    await onSubmit({
      name,
      businessName,
      industry: form.industry.trim(),
      website: normalizeWebsite(form.website),
      location: form.location.trim(),
    });
  };

  return (
    <ModalPortal>
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
        transition={{
          duration: 0.18,
        }}
        className="fixed inset-0 z-[100] flex min-h-full items-center justify-center bg-[#020617]/60 p-4 backdrop-blur-[3px] sm:p-6"
        role="presentation"
        onPointerDown={onClose}
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 14,
            scale: 0.985,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: 10,
            scale: 0.985,
          }}
          transition={{
            duration: 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-client-title"
          onPointerDown={(event) => event.stopPropagation()}
          className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[1.9rem] border border-white/70 bg-white shadow-[0_35px_120px_rgba(15,23,42,0.28)]"
        >
          <div className="shrink-0 border-b border-[#EEF2F7] px-6 py-6 sm:px-7">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                  <Pencil className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-sky-700">
                    Workspace management
                  </p>

                  <h2
                    id="edit-client-title"
                    className="mt-1 text-xl font-semibold tracking-[-0.035em] text-[#111827]"
                  >
                    Edit client workspace
                  </h2>

                  <p className="mt-1.5 text-xs leading-5 text-[#94A3B8]">
                    Update workspace details without changing the client login
                    identity.
                  </p>
                </div>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                disabled={isUpdating}
                aria-label="Close edit dialog"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#94A3B8] transition-colors hover:bg-[#F8FAFC] hover:text-[#475569] focus:outline-none focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="min-h-0 overflow-y-auto">
            <div className="p-6 sm:p-7">
              <div className="grid gap-5 sm:grid-cols-2">
                <EditField
                  label="Client name"
                  value={form.name}
                  placeholder="Client name"
                  onChange={(value) => updateField("name", value)}
                />

                <EditField
                  label="Email"
                  value={client.owner?.email || ""}
                  disabled
                  helper="Login email cannot be changed here."
                  onChange={() => undefined}
                />

                <EditField
                  label="Business name"
                  value={form.businessName}
                  placeholder="Business name"
                  onChange={(value) => updateField("businessName", value)}
                />

                <EditField
                  label="Industry"
                  value={form.industry}
                  placeholder="Industry"
                  onChange={(value) => updateField("industry", value)}
                />

                <EditField
                  label="Website"
                  value={form.website}
                  placeholder="example.com"
                  onChange={(value) => updateField("website", value)}
                />

                <EditField
                  label="Location"
                  value={form.location}
                  placeholder="Dhaka"
                  onChange={(value) => updateField("location", value)}
                />
              </div>

              <div className="mt-7 border-t border-[#EEF2F7] pt-6">
                <div className="rounded-2xl border border-amber-100 bg-amber-50/45 p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Archive className="h-4 w-4 text-amber-600" />

                        <p className="text-sm font-semibold text-[#374151]">
                          Archive workspace
                        </p>
                      </div>

                      <p className="mt-1 text-xs leading-5 text-[#94A3B8]">
                        Disable client access while preserving workspace
                        history.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={onArchive}
                      disabled={isUpdating}
                      className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-amber-200 bg-white px-4 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-50 focus:outline-none focus:ring-4 focus:ring-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Archive className="h-3.5 w-3.5" />
                      Archive
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#EEF2F7] pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isUpdating}
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm font-semibold text-[#374151] transition-colors hover:bg-[#F8FAFC] focus:outline-none focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#111827] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#1F2937] focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUpdating ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Saving changes
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Save changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </ModalPortal>
  );
}

/* -------------------------------------------------------------------------- */
/* EDIT FIELD                                                                 */
/* -------------------------------------------------------------------------- */

function EditField({
  label,
  value,
  placeholder,
  disabled = false,
  helper,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  disabled?: boolean;
  helper?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-[#374151]">
        {label}
      </label>

      <input
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-sm text-[#111827] outline-none transition-all placeholder:text-[#A1A1AA] hover:border-[#CBD5E1] focus:border-[#7DD3FC] focus:ring-4 focus:ring-[#E0F2FE] disabled:cursor-not-allowed disabled:bg-[#F8FAFC] disabled:text-[#94A3B8]"
      />

      {helper && <p className="mt-1.5 text-[10px] text-[#94A3B8]">{helper}</p>}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ARCHIVE MODAL                                                              */
/* -------------------------------------------------------------------------- */

function ArchiveClientModal({
  client,
  isArchiving,
  onClose,
  onConfirm,
}: {
  client: ClientWorkspace;
  isArchiving: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  return (
    <ModalPortal>
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
        transition={{
          duration: 0.18,
        }}
        className="fixed inset-0 z-[110] flex min-h-full items-center justify-center bg-[#020617]/65 p-4 backdrop-blur-[4px] sm:p-6"
        role="presentation"
        onPointerDown={onClose}
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 14,
            scale: 0.985,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: 10,
            scale: 0.985,
          }}
          transition={{
            duration: 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="archive-client-title"
          onPointerDown={(event) => event.stopPropagation()}
          className="w-full max-w-md overflow-hidden rounded-[1.8rem] border border-white/70 bg-white shadow-[0_35px_120px_rgba(15,23,42,0.28)]"
        >
          <div className="px-6 py-6 sm:px-7 sm:py-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <Archive className="h-5 w-5" />
            </div>

            <h2
              id="archive-client-title"
              className="mt-5 text-xl font-semibold tracking-[-0.035em] text-[#111827]"
            >
              Archive this workspace?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#64748B]">
              <span className="font-semibold text-[#374151]">
                {client.name}
              </span>{" "}
              will be removed from active client operations and its client
              access will be revoked.
            </p>

            <div className="mt-4 rounded-xl border border-slate-100 bg-[#F8FAFC] px-4 py-3">
              <p className="text-xs leading-5 text-[#64748B]">
                Workspace history remains preserved. This action disables access
                instead of permanently destroying historical records.
              </p>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                disabled={isArchiving}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm font-semibold text-[#374151] transition-colors hover:bg-[#F8FAFC] focus:outline-none focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={isArchiving}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isArchiving ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Archiving
                  </>
                ) : (
                  <>
                    <Archive className="h-4 w-4" />
                    Archive workspace
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </ModalPortal>
  );
}

/* -------------------------------------------------------------------------- */
/* LOADING DIRECTORY                                                          */
/* -------------------------------------------------------------------------- */

function LoadingDirectory() {
  return (
    <section className="overflow-hidden rounded-[1.9rem] border border-[#E5E7EB] bg-white shadow-[0_18px_60px_rgba(15,23,42,0.035)]">
      <div className="divide-y divide-[#F1F5F9]">
        {Array.from({
          length: 5,
        }).map((_, index) => (
          <div key={index} className="animate-pulse px-5 py-6 sm:px-6 lg:px-8">
            <div className="grid gap-5 md:grid-cols-5">
              <div className="flex gap-3.5">
                <div className="h-11 w-11 shrink-0 rounded-2xl bg-[#F1F5F9]" />

                <div className="flex-1">
                  <div className="h-4 w-36 rounded-full bg-[#F1F5F9]" />

                  <div className="mt-2 h-3 w-24 rounded-full bg-[#F8FAFC]" />

                  <div className="mt-3 h-3 w-32 rounded-full bg-[#F8FAFC]" />
                </div>
              </div>

              <div>
                <div className="h-4 w-28 rounded-full bg-[#F1F5F9]" />

                <div className="mt-2 h-3 w-36 rounded-full bg-[#F8FAFC]" />
              </div>

              <div className="h-7 w-20 rounded-full bg-[#F1F5F9]" />

              <div>
                <div className="h-3 w-20 rounded-full bg-[#F1F5F9]" />

                <div className="mt-2 h-3 w-28 rounded-full bg-[#F8FAFC]" />
              </div>

              <div className="h-9 w-9 justify-self-end rounded-lg bg-[#F1F5F9]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* EMPTY DIRECTORY                                                            */
/* -------------------------------------------------------------------------- */

function EmptyDirectory({
  search,
  onCreate,
}: {
  search: string;
  onCreate: () => void;
}) {
  return (
    <section className="rounded-[1.9rem] border border-dashed border-[#CBD5E1] bg-white px-6 py-20 text-center shadow-[0_18px_60px_rgba(15,23,42,0.03)]">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <Building2 className="h-6 w-6" />
      </div>

      <h3 className="mt-5 text-lg font-semibold tracking-[-0.025em] text-[#111827]">
        {search ? "No matching workspaces" : "No client workspaces yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#64748B]">
        {search
          ? "Try another client, owner, business or location."
          : "Create your first client workspace to start onboarding."}
      </p>

      {!search && (
        <button
          type="button"
          onClick={onCreate}
          className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#111827] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#1F2937]"
        >
          <Plus className="h-4 w-4" />
          Add first client
        </button>
      )}
    </section>
  );
}
