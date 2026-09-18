"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import {
  AlertCircle,
  Check,
  ChevronDown,
  Loader2,
  MoreHorizontal,
  ShieldCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";

import {
  getTeamMembers,
  inviteTeamMember,
  removeTeamMember,
  updateTeamMember,
  type TeamMember,
  type TeamRole,
} from "@/services/team.service";
import { getSettings } from "@/services/settings.service";

const roleDescriptions = [
  {
    role: "Owner",
    description: "Full workspace access, team management, and system settings.",
  },
  {
    role: "Admin",
    description: "Manage leads, workflow, reports, and operational settings.",
  },
  {
    role: "Sales",
    description: "Manage assigned leads, follow-ups, and sales activities.",
  },
];

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) {
    return "U";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const formatRole = (role: TeamRole) => {
  return role.charAt(0).toUpperCase() + role.slice(1);
};

const formatStatus = (status: TeamMember["status"]) => {
  return status === "active" ? "Active" : "Inactive";
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

type ModalProps = {
  children: ReactNode;
  onClose: () => void;
  title: string;
  eyebrow: string;
  description: string;
  width?: "sm" | "md";
};

function Modal({
  children,
  onClose,
  title,
  eyebrow,
  description,
  width = "md",
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      role="dialog"
      aria-modal="true"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={`flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl border border-border bg-surface shadow-[0_24px_80px_rgba(15,23,42,0.18)] sm:rounded-3xl ${
          width === "sm" ? "max-w-md" : "max-w-lg"
        }`}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border/70 px-5 py-5 sm:px-6">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
              {eyebrow}
            </p>

            <h3 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
              {title}
            </h3>

            <p className="mt-1 max-w-md text-sm leading-5 text-muted">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-muted transition-colors hover:bg-background hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

type FieldProps = {
  label: string;
  children: ReactNode;
  hint?: string;
};

function Field({ label, children, hint }: FieldProps) {
  return (
    <div>
      <label className="text-xs font-semibold text-foreground">{label}</label>

      {children}

      {hint && (
        <p className="mt-1.5 text-[11px] leading-4 text-muted">{hint}</p>
      )}
    </div>
  );
}

function ModalError({ message }: { message: string }) {
  if (!message) {
    return null;
  }

  return (
    <div className="flex items-start gap-2.5 rounded-2xl border border-danger/15 bg-danger/5 px-3.5 py-3 text-sm text-danger">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

      <p className="leading-5">{message}</p>
    </div>
  );
}

export default function TeamAccessSettings() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [sectionError, setSectionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const [inviteError, setInviteError] = useState("");
  const [manageError, setManageError] = useState("");
  const [removeError, setRemoveError] = useState("");

  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "sales" as "admin" | "sales",
  });

  const [manageForm, setManageForm] = useState({
    name: "",
    role: "sales" as "admin" | "sales",
    isActive: true,
  });

  const currentMember = useMemo(() => {
    if (!currentUserEmail) {
      return null;
    }

    return (
      members.find(
        (member) =>
          member.email.toLowerCase() === currentUserEmail.toLowerCase(),
      ) ?? null
    );
  }, [members, currentUserEmail]);

  const currentUserRole = currentMember?.role ?? null;

  const canManageTeam =
    currentUserRole === "owner" || currentUserRole === "admin";

  const canAssignAdmin = currentUserRole === "owner";

  const canRemoveMembers = currentUserRole === "owner";

  const canModifyMember = (member: TeamMember) => {
    if (!canManageTeam) {
      return false;
    }

    if (member.role === "owner") {
      return false;
    }

    if (currentUserRole === "admin" && member.role === "admin") {
      return false;
    }

    return true;
  };

  const clearMessages = () => {
    setSectionError("");
    setSuccessMessage("");
  };

  const loadTeam = async () => {
    try {
      setLoading(true);
      setSectionError("");

      const [teamMembers, settings] = await Promise.all([
        getTeamMembers(),
        getSettings(),
      ]);

      setMembers(teamMembers);
      setCurrentUserEmail(settings.account.email);
    } catch (error) {
      setSectionError(
        getErrorMessage(error, "Unable to load workspace members."),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const openInviteModal = () => {
    clearMessages();
    setInviteError("");

    setInviteForm({
      name: "",
      email: "",
      password: "",
      role: "sales",
    });

    setShowInviteModal(true);
  };

  const closeInviteModal = () => {
    if (actionLoading) {
      return;
    }

    setShowInviteModal(false);
    setInviteError("");
  };

  const handleInviteFieldChange = (
    field: keyof typeof inviteForm,
    value: string,
  ) => {
    setInviteForm((current) => ({
      ...current,
      [field]: value,
    }));

    setInviteError("");
  };

  const handleInvite = async () => {
    const name = inviteForm.name.trim();
    const email = inviteForm.email.trim().toLowerCase();
    const password = inviteForm.password;

    if (!name) {
      setInviteError("Member name is required.");
      return;
    }

    if (!email) {
      setInviteError("Member email is required.");
      return;
    }

    if (!email.includes("@")) {
      setInviteError("Enter a valid email address.");
      return;
    }

    if (!password) {
      setInviteError("Temporary password is required.");
      return;
    }

    if (password.length < 8) {
      setInviteError("Temporary password must be at least 8 characters.");
      return;
    }

    if (inviteForm.role === "admin" && !canAssignAdmin) {
      setInviteError("Only the workspace owner can assign admin access.");
      return;
    }

    try {
      setActionLoading(true);
      setInviteError("");
      clearMessages();

      const member = await inviteTeamMember({
        name,
        email,
        password,
        role: inviteForm.role,
      });

      setMembers((current) => [...current, member]);

      setShowInviteModal(false);

      setSuccessMessage(`${member.name} was added to the workspace.`);
    } catch (error) {
      setInviteError(getErrorMessage(error, "Unable to add team member."));
    } finally {
      setActionLoading(false);
    }
  };

  const openManageModal = (member: TeamMember) => {
    if (!canModifyMember(member)) {
      return;
    }

    clearMessages();
    setManageError("");

    setSelectedMember(member);

    setManageForm({
      name: member.name,
      role: member.role === "admin" ? "admin" : "sales",
      isActive: member.status === "active",
    });

    setShowManageModal(true);
  };

  const closeManageModal = () => {
    if (actionLoading) {
      return;
    }

    setShowManageModal(false);
    setManageError("");
    setSelectedMember(null);
  };

  const handleManageFieldChange = (
    field: keyof typeof manageForm,
    value: string | boolean,
  ) => {
    setManageForm((current) => ({
      ...current,
      [field]: value,
    }));

    setManageError("");
  };

  const handleManageSave = async () => {
    if (!selectedMember) {
      return;
    }

    const name = manageForm.name.trim();

    if (!name) {
      setManageError("Member name is required.");
      return;
    }

    if (manageForm.role === "admin" && !canAssignAdmin) {
      setManageError("Only the workspace owner can assign admin access.");
      return;
    }

    try {
      setActionLoading(true);
      setManageError("");
      clearMessages();

      const updatedMember = await updateTeamMember(selectedMember.id, {
        name,
        role: manageForm.role,
        isActive: manageForm.isActive,
      });

      setMembers((current) =>
        current.map((member) =>
          member.id === updatedMember.id ? updatedMember : member,
        ),
      );

      setShowManageModal(false);
      setSelectedMember(null);

      setSuccessMessage(
        `${updatedMember.name}'s access was updated successfully.`,
      );
    } catch (error) {
      setManageError(getErrorMessage(error, "Unable to update team member."));
    } finally {
      setActionLoading(false);
    }
  };

  const openRemoveModal = (member: TeamMember) => {
    if (!canRemoveMembers) {
      return;
    }

    if (member.role === "owner") {
      return;
    }

    clearMessages();
    setRemoveError("");

    setSelectedMember(member);
    setShowManageModal(false);
    setShowRemoveModal(true);
  };

  const closeRemoveModal = () => {
    if (actionLoading) {
      return;
    }

    setShowRemoveModal(false);
    setRemoveError("");
    setSelectedMember(null);
  };

  const handleRemove = async () => {
    if (!selectedMember) {
      return;
    }

    try {
      setActionLoading(true);
      setRemoveError("");
      clearMessages();

      await removeTeamMember(selectedMember.id);

      setMembers((current) =>
        current.filter((member) => member.id !== selectedMember.id),
      );

      const removedName = selectedMember.name;

      setShowRemoveModal(false);
      setSelectedMember(null);

      setSuccessMessage(`${removedName} was removed from the workspace.`);
    } catch (error) {
      setRemoveError(getErrorMessage(error, "Unable to remove team member."));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <section className="mt-6 overflow-hidden rounded-3xl border border-border/80 bg-surface shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col gap-5 border-b border-border/70 px-6 py-6 sm:px-7 sm:py-7 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Users className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                Team & access
              </p>

              <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                Manage your sales team
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                Control who can access the workspace and define the level of
                responsibility each team member has.
              </p>
            </div>
          </div>

          {canManageTeam && (
            <button
              type="button"
              onClick={openInviteModal}
              className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-dark hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 sm:w-auto"
            >
              <UserPlus className="h-4 w-4" />
              Invite member
            </button>
          )}
        </div>

        <div className="p-6 sm:p-7">
          {sectionError && (
            <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-danger/15 bg-danger/5 px-4 py-3 text-sm text-danger">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

              <p className="leading-5">{sectionError}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-success/15 bg-success/5 px-4 py-3 text-sm text-success">
              <Check className="mt-0.5 h-4 w-4 shrink-0" />

              <p className="leading-5">{successMessage}</p>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Users className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                Workspace members
              </p>

              <p className="mt-0.5 text-xs text-muted">
                {loading
                  ? "Loading workspace members..."
                  : `${members.length} ${
                      members.length === 1 ? "member" : "members"
                    } with access to this workspace`}
              </p>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-border/80">
            <div className="hidden grid-cols-[minmax(0,1fr)_140px_120px_100px_44px] items-center gap-4 border-b border-border/70 bg-background/60 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted sm:grid">
              <span>Member</span>
              <span className="text-center">Role</span>
              <span className="text-center">Assigned leads</span>
              <span className="text-center">Status</span>
              <span />
            </div>

            <div className="divide-y divide-border/70">
              {loading ? (
                <div className="space-y-0">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 px-4 py-5"
                    >
                      <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-background" />

                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="h-3.5 w-32 animate-pulse rounded bg-background" />
                        <div className="h-3 w-44 max-w-full animate-pulse rounded bg-background" />
                      </div>

                      <div className="hidden h-7 w-16 animate-pulse rounded-full bg-background sm:block" />
                    </div>
                  ))}
                </div>
              ) : members.length === 0 ? (
                <div className="px-5 py-14 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                    <Users className="h-5 w-5" />
                  </div>

                  <p className="mt-4 text-sm font-semibold text-foreground">
                    No team members found
                  </p>

                  <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-muted">
                    Add your first team member to start managing workspace
                    access.
                  </p>

                  {canManageTeam && (
                    <button
                      type="button"
                      onClick={openInviteModal}
                      className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-xs font-semibold text-white transition hover:bg-primary-dark"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      Add member
                    </button>
                  )}
                </div>
              ) : (
                members.map((member) => {
                  const manageable = canModifyMember(member);

                  return (
                    <div
                      key={member.id}
                      className="group flex flex-col gap-4 px-4 py-4 transition-colors duration-200 hover:bg-background/60 sm:grid sm:grid-cols-[minmax(0,1fr)_140px_120px_100px_44px] sm:items-center sm:gap-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt=""
                            className="h-10 w-10 shrink-0 rounded-xl object-cover ring-1 ring-border"
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-sm font-semibold text-primary ring-1 ring-primary/10">
                            {getInitials(member.name)}
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="flex min-w-0 items-center gap-2">
                            <p className="truncate text-sm font-semibold text-foreground">
                              {member.name}
                            </p>

                            {member.id === currentMember?.id && (
                              <span className="shrink-0 rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-semibold text-primary">
                                You
                              </span>
                            )}
                          </div>

                          <p className="mt-0.5 truncate text-xs text-muted">
                            {member.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-center">
                        <span className="text-xs text-muted sm:hidden">
                          Role
                        </span>

                        <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-2.5 py-1 text-xs font-semibold text-body ring-1 ring-border/70">
                          {member.role === "owner" && (
                            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                          )}

                          {formatRole(member.role)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between sm:justify-center">
                        <span className="text-xs text-muted sm:hidden">
                          Assigned leads
                        </span>

                        <span className="text-sm font-semibold tabular-nums text-foreground">
                          {member.assignedLeads}
                        </span>
                      </div>

                      <div className="flex items-center justify-between sm:justify-center">
                        <span className="text-xs text-muted sm:hidden">
                          Status
                        </span>

                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                            member.status === "active"
                              ? "text-success"
                              : "text-muted"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              member.status === "active"
                                ? "bg-success"
                                : "bg-muted"
                            }`}
                          />

                          {formatStatus(member.status)}
                        </span>
                      </div>

                      <div className="flex items-center justify-end sm:justify-center">
                        {manageable ? (
                          <button
                            type="button"
                            aria-label={`Manage ${member.name}`}
                            onClick={() => openManageModal(member)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors duration-200 hover:bg-background hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        ) : (
                          <span
                            className="flex h-8 w-8 items-center justify-center text-muted/40"
                            aria-hidden="true"
                          >
                            —
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />

              <h3 className="text-sm font-semibold text-foreground">
                Access levels
              </h3>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {roleDescriptions.map((item) => (
                <div
                  key={item.role}
                  className="rounded-2xl border border-border/70 bg-background/60 p-4 transition-colors duration-200 hover:border-primary/15 hover:bg-primary-soft/30"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">
                      {item.role}
                    </p>

                    <span className="h-2 w-2 rounded-full bg-primary" />
                  </div>

                  <p className="mt-2 text-xs leading-5 text-muted">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border/70 bg-background/50 px-6 py-4 sm:px-7">
          <p className="text-xs leading-5 text-muted">
            Access changes are protected by workspace authorization rules and
            enforced by the backend.
          </p>
        </div>
      </section>

      {showInviteModal && (
        <Modal
          onClose={closeInviteModal}
          eyebrow="Team access"
          title="Add team member"
          description="Create a workspace account and assign the appropriate access level."
        >
          <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
            <ModalError message={inviteError} />

            <Field label="Full name">
              <input
                autoFocus
                value={inviteForm.name}
                onChange={(event) =>
                  handleInviteFieldChange("name", event.target.value)
                }
                placeholder="e.g. Nadia Karim"
                className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </Field>

            <Field label="Email">
              <input
                type="email"
                value={inviteForm.email}
                onChange={(event) =>
                  handleInviteFieldChange("email", event.target.value)
                }
                placeholder="member@example.com"
                className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </Field>

            <Field
              label="Temporary password"
              hint="The member can use this password to sign in."
            >
              <input
                type="password"
                value={inviteForm.password}
                onChange={(event) =>
                  handleInviteFieldChange("password", event.target.value)
                }
                placeholder="Minimum 8 characters"
                className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </Field>

            <Field
              label="Access level"
              hint={
                canAssignAdmin
                  ? "Owner access can assign Admin or Sales."
                  : "Admin access can add Sales members."
              }
            >
              <div className="relative mt-2">
                <select
                  value={inviteForm.role}
                  onChange={(event) =>
                    handleInviteFieldChange("role", event.target.value)
                  }
                  className="h-11 w-full appearance-none rounded-xl border border-border bg-background px-3 pr-10 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                >
                  <option value="sales">Sales</option>

                  {canAssignAdmin && <option value="admin">Admin</option>}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              </div>
            </Field>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-border/70 bg-background/50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={closeInviteModal}
              disabled={actionLoading}
              className="h-10 rounded-xl px-4 text-sm font-semibold text-muted transition-colors hover:bg-background hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleInvite}
              disabled={actionLoading}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {actionLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Add member
            </button>
          </div>
        </Modal>
      )}

      {showManageModal && selectedMember && (
        <Modal
          onClose={closeManageModal}
          eyebrow="Manage member"
          title={selectedMember.name}
          description="Update this member's workspace role, name, or account status."
        >
          <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
            <ModalError message={manageError} />

            <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/60 p-3.5">
              {selectedMember.avatar ? (
                <img
                  src={selectedMember.avatar}
                  alt=""
                  className="h-11 w-11 rounded-xl object-cover ring-1 ring-border"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-sm font-semibold text-primary">
                  {getInitials(selectedMember.name)}
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {selectedMember.name}
                </p>

                <p className="truncate text-xs text-muted">
                  {selectedMember.email}
                </p>
              </div>
            </div>

            <Field label="Full name">
              <input
                autoFocus
                value={manageForm.name}
                onChange={(event) =>
                  handleManageFieldChange("name", event.target.value)
                }
                className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </Field>

            <Field label="Access level">
              <div className="relative mt-2">
                <select
                  value={manageForm.role}
                  onChange={(event) =>
                    handleManageFieldChange("role", event.target.value)
                  }
                  disabled={!canAssignAdmin}
                  className="h-11 w-full appearance-none rounded-xl border border-border bg-background px-3 pr-10 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="sales">Sales</option>

                  {canAssignAdmin && <option value="admin">Admin</option>}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              </div>

              {!canAssignAdmin && (
                <p className="mt-1.5 text-[11px] leading-4 text-muted">
                  Only the workspace owner can change admin access.
                </p>
              )}
            </Field>

            <div className="flex min-w-0 items-center justify-between gap-4 rounded-2xl border border-border/70 bg-background/60 px-4 py-3.5">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">
                  Account status
                </p>

                <p className="mt-0.5 text-xs leading-5 text-muted">
                  Inactive members cannot authenticate.
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={manageForm.isActive}
                aria-label="Toggle account status"
                onClick={() =>
                  handleManageFieldChange("isActive", !manageForm.isActive)
                }
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 ${
                  manageForm.isActive ? "bg-primary" : "bg-border"
                }`}
              >
                <span
                  className={`block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    manageForm.isActive ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-border/70 bg-background/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            {canRemoveMembers && selectedMember.role !== "owner" ? (
              <button
                type="button"
                onClick={() => openRemoveModal(selectedMember)}
                disabled={actionLoading}
                className="h-10 rounded-xl px-3 text-sm font-semibold text-danger transition-colors hover:bg-danger/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Remove member
              </button>
            ) : (
              <div />
            )}

            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <button
                type="button"
                onClick={closeManageModal}
                disabled={actionLoading}
                className="h-10 rounded-xl px-4 text-sm font-semibold text-muted transition-colors hover:bg-background hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleManageSave}
                disabled={actionLoading}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {actionLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Save changes
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showRemoveModal && selectedMember && (
        <Modal
          onClose={closeRemoveModal}
          eyebrow="Remove member"
          title="Remove workspace access?"
          description="This action cannot be undone from the workspace."
          width="sm"
        >
          <div className="px-5 py-5 sm:px-6 sm:py-6">
            <ModalError message={removeError} />

            <div className="rounded-2xl border border-danger/15 bg-danger/5 p-4">
              <div className="flex items-center gap-3">
                {selectedMember.avatar ? (
                  <img
                    src={selectedMember.avatar}
                    alt=""
                    className="h-10 w-10 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger/10 text-sm font-semibold text-danger">
                    {getInitials(selectedMember.name)}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {selectedMember.name}
                  </p>

                  <p className="truncate text-xs text-muted">
                    {selectedMember.email}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-body">
                This member will lose access to the workspace. If they still
                have assigned leads, the backend will prevent removal until
                those leads are reassigned.
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-border/70 bg-background/50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={closeRemoveModal}
              disabled={actionLoading}
              className="h-10 rounded-xl px-4 text-sm font-semibold text-muted transition-colors hover:bg-background hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleRemove}
              disabled={actionLoading}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-danger px-5 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {actionLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Remove member
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
