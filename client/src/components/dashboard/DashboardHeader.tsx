"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";

import Link from "next/link";

import { useRouter } from "next/navigation";

import {
  Bell,
  ChevronDown,
  LoaderCircle,
  LogOut,
  Menu,
  Search,
  Settings,
  UserRound,
  X,
} from "lucide-react";

import { useNotifications } from "@/components/notifications/NotificationProvider";
import { getSettings } from "@/services/settings.service";
import api from "@/lib/api";

type DashboardHeaderProps = {
  onMenuOpen: () => void;
};

type SearchLead = {
  _id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  status?: string | null;
  temperature?: string | null;
  score?: number | null;
};

type LeadSearchResponse = {
  success?: boolean;
  message?: string;
  data?:
    | SearchLead[]
    | {
        leads?: SearchLead[];
      };
};

type SearchResultsProps = {
  isSearching: boolean;
  searchError: string | null;
  searchResults: SearchLead[];
  trimmedQuery: string;
  onSelect: (leadId: string) => void;
  onClose: () => void;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const getInitials = (name: string) => {
  const normalized = name.trim();

  if (!normalized) {
    return "?";
  }

  const parts = normalized.split(/\s+/);

  if (parts.length === 1) {
    return parts[0].slice(0, 1).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const normalizeLeadResults = (response: LeadSearchResponse): SearchLead[] => {
  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (
    response.data &&
    !Array.isArray(response.data) &&
    Array.isArray(response.data.leads)
  ) {
    return response.data.leads;
  }

  return [];
};

const formatStatus = (value?: string | null) => {
  if (!value) {
    return null;
  }

  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const getTemperatureClasses = (temperature?: string | null) => {
  switch (temperature) {
    case "hot":
      return "bg-orange-50 text-orange-700";

    case "warm":
      return "bg-amber-50 text-amber-700";

    case "cold":
      return "bg-sky-50 text-sky-700";

    default:
      return "bg-background text-muted";
  }
};

function SearchResults({
  isSearching,
  searchError,
  searchResults,
  trimmedQuery,
  onSelect,
  onClose,
}: SearchResultsProps) {
  if (isSearching) {
    return (
      <div className="flex items-center gap-3 px-4 py-5 text-sm text-muted">
        <LoaderCircle className="h-4 w-4 animate-spin text-primary" />
        Searching leads...
      </div>
    );
  }

  if (searchError) {
    return <div className="px-4 py-5 text-sm text-danger">{searchError}</div>;
  }

  if (searchResults.length === 0) {
    return (
      <div className="px-4 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background text-muted">
          <UserRound className="h-4.5 w-4.5" />
        </div>

        <p className="mt-3 text-sm font-semibold text-foreground">
          No leads found
        </p>

        <p className="mt-1 text-xs leading-5 text-muted">
          Try another name, email, or phone number.
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-[min(420px,60vh)] overflow-y-auto p-2">
      {searchResults.map((lead) => {
        const status = formatStatus(lead.status);

        return (
          <button
            key={lead._id}
            type="button"
            onClick={() => onSelect(lead._id)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-background focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/10"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-sm font-bold text-primary">
              {getInitials(lead.name)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold text-foreground">
                  {lead.name}
                </p>

                {lead.temperature && (
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${getTemperatureClasses(
                      lead.temperature,
                    )}`}
                  >
                    {formatStatus(lead.temperature)}
                  </span>
                )}
              </div>

              <p className="mt-0.5 truncate text-xs text-muted">
                {lead.email || lead.phone || "No contact information"}
              </p>

              <div className="mt-1.5 flex items-center gap-2">
                {status && (
                  <span className="text-[10px] font-medium text-muted">
                    {status}
                  </span>
                )}

                {typeof lead.score === "number" && (
                  <span className="text-[10px] font-semibold text-primary">
                    Score {lead.score}
                  </span>
                )}
              </div>
            </div>

            <ChevronDown className="h-4 w-4 -rotate-90 shrink-0 text-muted" />
          </button>
        );
      })}

      {searchResults.length >= 10 && (
        <Link
          href={`/dashboard/leads?search=${encodeURIComponent(trimmedQuery)}`}
          onClick={onClose}
          className="flex items-center justify-center border-t border-border/70 px-3 py-3 text-xs font-semibold text-primary transition-colors hover:bg-background"
        >
          View all matching leads
        </Link>
      )}
    </div>
  );
}

export default function DashboardHeader({ onMenuOpen }: DashboardHeaderProps) {
  const router = useRouter();

  const { unreadCount } = useNotifications();

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [userName, setUserName] = useState("");

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [avatarError, setAvatarError] = useState(false);

  const [isAccountLoading, setIsAccountLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");

  const [searchResults, setSearchResults] = useState<SearchLead[]>([]);

  const [isSearching, setIsSearching] = useState(false);

  const [searchError, setSearchError] = useState<string | null>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  const searchRef = useRef<HTMLDivElement>(null);

  /* ---------------------------------------------------------------------- */
  /* LOAD AUTHENTICATED ACCOUNT                                             */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    let mounted = true;

    const loadAccountSettings = async () => {
      try {
        setIsAccountLoading(true);

        const settings = await getSettings();

        if (!mounted) {
          return;
        }

        const accountName = settings.account?.name?.trim() || "";

        setUserName(accountName);

        setAvatarUrl(settings.account?.avatar || null);

        setAvatarError(false);
      } catch (error) {
        console.error(
          "Failed to load account settings for dashboard header:",
          error,
        );
      } finally {
        if (mounted) {
          setIsAccountLoading(false);
        }
      }
    };

    void loadAccountSettings();

    return () => {
      mounted = false;
    };
  }, []);

  /* ---------------------------------------------------------------------- */
  /* CLOSE DROPDOWNS ON OUTSIDE CLICK                                       */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileOpen(false);
      }

      if (searchRef.current && !searchRef.current.contains(target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ---------------------------------------------------------------------- */
  /* ESCAPE HANDLER                                                         */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      setIsSearchOpen(false);
      setIsMobileSearchOpen(false);
      setIsProfileOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /* ---------------------------------------------------------------------- */
  /* LEAD SEARCH                                                             */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const query = searchQuery.trim();

    if (query.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      setSearchError(null);

      return;
    }

    let mounted = true;

    const timer = window.setTimeout(async () => {
      try {
        setIsSearching(true);
        setSearchError(null);

        const response = await api.get<LeadSearchResponse>("/leads", {
          params: {
            search: query,
          },
        });

        if (!mounted) {
          return;
        }

        setSearchResults(normalizeLeadResults(response.data));
      } catch (error) {
        if (!mounted) {
          return;
        }

        console.error("Failed to search leads:", error);

        setSearchResults([]);
        setSearchError("Unable to search leads right now.");
      } finally {
        if (mounted) {
          setIsSearching(false);
        }
      }
    }, 350);

    return () => {
      mounted = false;
      window.clearTimeout(timer);
    };
  }, [searchQuery]);

  const handleSearchFocus = () => {
    if (searchQuery.trim().length >= 2) {
      setIsSearchOpen(true);
    }
  };

  const handleSearchResultClick = (leadId: string) => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchError(null);
    setIsSearchOpen(false);
    setIsMobileSearchOpen(false);

    router.push(`/dashboard/leads/${leadId}`);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchError(null);
    setIsSearchOpen(false);
    setIsMobileSearchOpen(false);
  };

  /* ---------------------------------------------------------------------- */
  /* LOGOUT                                                                  */
  /* ---------------------------------------------------------------------- */

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      setIsProfileOpen(false);

      router.push("/auth/login");
      router.refresh();

      setIsLoggingOut(false);
    }
  };

  /* ---------------------------------------------------------------------- */
  /* DERIVED STATE                                                           */
  /* ---------------------------------------------------------------------- */

  const notificationLabel =
    unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications";

  const displayName = userName || "Workspace owner";

  const initials = getInitials(userName);

  const showAvatar = Boolean(avatarUrl) && !avatarError;

  const trimmedQuery = searchQuery.trim();

  const showSearchDropdown = isSearchOpen && trimmedQuery.length >= 2;

  const showMobileSearchResults =
    isMobileSearchOpen && trimmedQuery.length >= 2;

  /* ---------------------------------------------------------------------- */
  /* RENDER                                                                  */
  /* ---------------------------------------------------------------------- */

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-white/90 backdrop-blur-xl">
      <div className="flex min-h-16 items-center justify-between gap-3 px-4 sm:min-h-18 sm:px-6 lg:px-10">
        {/* ---------------------------------------------------------------- */}
        {/* LEFT                                                               */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={onMenuOpen}
            aria-label="Open navigation"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-muted transition-colors hover:bg-background hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 lg:hidden"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white">
              L
            </span>

            <span className="hidden text-base font-semibold tracking-tight text-foreground xs:block sm:text-lg">
              LeadFlow
            </span>
          </Link>

          {/* -------------------------------------------------------------- */}
          {/* DESKTOP SEARCH                                                  */}
          {/* -------------------------------------------------------------- */}

          <div
            ref={searchRef}
            className="relative hidden w-full max-w-md md:block"
          >
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted" />

            <input
              type="search"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);

                setIsSearchOpen(true);
              }}
              onFocus={handleSearchFocus}
              placeholder="Search leads, contacts..."
              aria-label="Search leads and contacts"
              aria-expanded={showSearchDropdown}
              aria-autocomplete="list"
              className="h-10 w-full rounded-xl border border-border bg-background pl-10 pr-10 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-primary/10"
            />

            {searchQuery && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted transition-colors hover:text-foreground"
              >
                ×
              </button>
            )}

            {showSearchDropdown && (
              <div className="absolute left-0 right-0 top-[calc(100%+10px)] overflow-hidden rounded-2xl border border-border bg-surface shadow-xl shadow-black/8">
                <SearchResults
                  isSearching={isSearching}
                  searchError={searchError}
                  searchResults={searchResults}
                  trimmedQuery={trimmedQuery}
                  onSelect={handleSearchResultClick}
                  onClose={clearSearch}
                />
              </div>
            )}
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* RIGHT                                                              */}
        {/* ---------------------------------------------------------------- */}

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          {/* -------------------------------------------------------------- */}
          {/* MOBILE SEARCH                                                   */}
          {/* -------------------------------------------------------------- */}

          <button
            type="button"
            onClick={() => {
              setIsMobileSearchOpen(true);
            }}
            aria-label="Search leads and contacts"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-muted transition-colors hover:bg-background hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 md:hidden"
          >
            <Search className="h-4.5 w-4.5" />
          </button>

          {/* -------------------------------------------------------------- */}
          {/* NOTIFICATIONS                                                   */}
          {/* -------------------------------------------------------------- */}

          <button
            type="button"
            onClick={() => router.push("/dashboard/notifications")}
            aria-label={notificationLabel}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-muted transition-all duration-200 hover:border-primary/20 hover:bg-primary-soft/40 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
          >
            <Bell className="h-4.5 w-4.5" aria-hidden="true" />

            {unreadCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-danger px-1 text-[10px] font-bold leading-none text-white shadow-sm"
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {/* -------------------------------------------------------------- */}
          {/* PROFILE                                                         */}
          {/* -------------------------------------------------------------- */}

          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => setIsProfileOpen((open) => !open)}
              aria-expanded={isProfileOpen}
              aria-haspopup="menu"
              className="flex items-center gap-2 rounded-xl border border-transparent px-1.5 py-1.5 transition-colors hover:border-border hover:bg-background sm:gap-2.5 sm:px-2"
            >
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-soft text-sm font-semibold text-primary ring-1 ring-primary/10">
                {showAvatar ? (
                  <Image
                    src={avatarUrl as string}
                    alt={`${displayName} profile`}
                    fill
                    sizes="36px"
                    className="object-cover"
                    onError={() => setAvatarError(true)}
                  />
                ) : isAccountLoading ? (
                  <LoaderCircle className="h-4 w-4 animate-spin text-primary" />
                ) : (
                  <span>{initials}</span>
                )}
              </div>

              <div className="hidden text-left sm:block">
                <p className="max-w-32 truncate text-sm font-semibold text-foreground">
                  {isAccountLoading ? "Loading..." : displayName}
                </p>

                <p className="text-xs text-muted">Owner</p>
              </div>

              <ChevronDown
                className={`hidden h-4 w-4 text-muted transition-transform sm:block ${
                  isProfileOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            {isProfileOpen && (
              <div
                role="menu"
                className="absolute right-0 top-[calc(100%+10px)] w-[min(17rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-border bg-surface p-2 shadow-xl shadow-black/8"
              >
                <div className="border-b border-border px-3 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-soft text-sm font-semibold text-primary">
                      {showAvatar ? (
                        <Image
                          src={avatarUrl as string}
                          alt={`${displayName} profile`}
                          fill
                          sizes="40px"
                          className="object-cover"
                          onError={() => setAvatarError(true)}
                        />
                      ) : isAccountLoading ? (
                        <LoaderCircle className="h-4 w-4 animate-spin text-primary" />
                      ) : (
                        <span>{initials}</span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {isAccountLoading ? "Loading..." : displayName}
                      </p>

                      <p className="mt-0.5 text-xs text-muted">Owner</p>
                    </div>
                  </div>
                </div>

                <div className="py-1.5">
                  <Link
                    href="/dashboard/notifications"
                    role="menuitem"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-body transition-colors hover:bg-background hover:text-foreground"
                  >
                    <span className="flex items-center gap-3">
                      <Bell className="h-4 w-4" />
                      Notifications
                    </span>

                    {unreadCount > 0 && (
                      <span className="rounded-full bg-danger px-2 py-0.5 text-[10px] font-bold text-white">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/dashboard/settings"
                    role="menuitem"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-body transition-colors hover:bg-background hover:text-foreground"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>

                  <button
                    type="button"
                    role="menuitem"
                    disabled={isLoggingOut}
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-danger transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <LogOut className="h-4 w-4" />

                    {isLoggingOut ? "Logging out..." : "Log out"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* MOBILE SEARCH PANEL                                                */}
      {/* ------------------------------------------------------------------ */}

      {isMobileSearchOpen && (
        <div className="absolute inset-x-0 top-full border-b border-border/70 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-xl md:hidden">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

            <input
              type="search"
              autoFocus
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search leads, contacts..."
              aria-label="Search leads and contacts"
              className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-20 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-primary/10"
            />

            <button
              type="button"
              onClick={() => {
                if (searchQuery) {
                  clearSearch();
                  return;
                }

                setIsMobileSearchOpen(false);
              }}
              aria-label={searchQuery ? "Clear search" : "Close search"}
              className="absolute right-2 top-1/2 flex h-8 -translate-y-1/2 items-center justify-center rounded-lg px-2 text-xs font-semibold text-muted transition-colors hover:bg-background hover:text-foreground"
            >
              {searchQuery ? "Clear" : <X className="h-4 w-4" />}
            </button>
          </div>

          {showMobileSearchResults && (
            <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-surface shadow-xl shadow-black/8">
              <SearchResults
                isSearching={isSearching}
                searchError={searchError}
                searchResults={searchResults}
                trimmedQuery={trimmedQuery}
                onSelect={handleSearchResultClick}
                onClose={clearSearch}
              />
            </div>
          )}
        </div>
      )}
    </header>
  );
}
