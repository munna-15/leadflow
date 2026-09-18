
"use client";

import {
  Camera,
  ImagePlus,
  LoaderCircle,
  Mail,
  Save,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getSettings,
  updateSettings,
  type AccountSettings as AccountSettingsData,
} from "@/services/settings.service";

import {
  removeAvatar,
  uploadAvatar,
} from "@/services/avatar.service";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const TIMEZONE_OPTIONS = [
  {
    value: "Asia/Dhaka",
    label: "Bangladesh Standard Time",
  },
  {
    value: "Asia/Kolkata",
    label: "India Standard Time",
  },
  {
    value: "Asia/Dubai",
    label: "Gulf Standard Time",
  },
  {
    value: "Europe/London",
    label: "United Kingdom",
  },
  {
    value: "America/New_York",
    label: "Eastern Time",
  },
];

export default function AccountSettings() {
  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const [account, setAccount] =
    useState<AccountSettingsData | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [timezone, setTimezone] =
    useState("Asia/Dhaka");

  const [selectedImage, setSelectedImage] =
    useState<File | null>(null);

  const [previewUrl, setPreviewUrl] =
    useState<string | null>(null);

  const [imageError, setImageError] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploadingAvatar, setUploadingAvatar] =
    useState(false);

  const [removingAvatar, setRemovingAvatar] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      try {
        setLoading(true);
        setError("");

        const settings = await getSettings();

        if (!mounted) {
          return;
        }

        setAccount(settings.account);
        setName(settings.account.name);
        setEmail(settings.account.email);
        setTimezone(settings.account.timezone);
      } catch (error) {
        if (!mounted) {
          return;
        }

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load account settings.",
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl =
      URL.createObjectURL(selectedImage);

    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedImage]);

  const handleImageSelect = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setImageError("");
    setError("");
    setSuccess("");

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setSelectedImage(null);
      event.target.value = "";

      setImageError(
        "Please select a JPG, PNG, or WebP image.",
      );

      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setSelectedImage(null);
      event.target.value = "";

      setImageError(
        "Profile photo must be smaller than 5 MB.",
      );

      return;
    }

    setSelectedImage(file);
  };

  const handleCancelSelectedImage = () => {
    setSelectedImage(null);
    setImageError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChooseImage = () => {
    if (uploadingAvatar || removingAvatar) {
      return;
    }

    fileInputRef.current?.click();
  };

  const handleUploadAvatar = async () => {

    if (!selectedImage) {
      return;
    }


    try {
      setUploadingAvatar(true);
      setImageError("");
      setError("");
      setSuccess("");

      const avatar =
        await uploadAvatar(selectedImage);

      setAccount((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          avatar,
        };
      });

      setSelectedImage(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setSuccess(
        "Profile photo updated successfully.",
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to upload profile photo.",
      );
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!account?.avatar) {
      return;
    }

    try {
      setRemovingAvatar(true);
      setImageError("");
      setError("");
      setSuccess("");

      await removeAvatar();

      setAccount((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          avatar: null,
        };
      });

      setSuccess(
        "Profile photo removed successfully.",
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to remove profile photo.",
      );
    } finally {
      setRemovingAvatar(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Full name is required.");
      setSuccess("");
      return;
    }

    if (!email.trim()) {
      setError("Email address is required.");
      setSuccess("");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updatedSettings =
        await updateSettings({
          account: {
            name: name.trim(),
            email: email.trim(),
            timezone,
          },
        });

      setAccount(updatedSettings.account);
      setName(updatedSettings.account.name);
      setEmail(updatedSettings.account.email);
      setTimezone(
        updatedSettings.account.timezone,
      );

      setSuccess(
        "Account settings updated successfully.",
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update account settings.",
      );
    } finally {
      setSaving(false);
    }
  };

  const displayAvatar =
    previewUrl || account?.avatar || null;

  const initials =
    account?.name
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() || "M";

  if (loading) {
    return (
      <section className="mt-8 overflow-hidden rounded-3xl border border-border/80 bg-surface shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <div className="flex min-h-[360px] items-center justify-center">
          <div className="flex items-center gap-2 text-sm font-medium text-muted">
            <LoaderCircle className="h-4 w-4 animate-spin text-primary" />
            Loading account settings...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8 overflow-hidden rounded-3xl border border-border/80 bg-surface shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
      <div className="border-b border-border/70 px-6 py-6 sm:px-7 sm:py-7">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <UserRound className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Account
            </p>

            <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Profile & account
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Manage the personal information and account identity used across
              your LeadFlow workspace.
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

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="flex shrink-0 items-center gap-5 border-b border-border/70 pb-7 sm:gap-6 lg:w-56 lg:flex-col lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-[26px] bg-gradient-to-br from-primary-soft to-sky-50 text-3xl font-semibold text-primary shadow-sm ring-1 ring-primary/10">
                {displayAvatar ? (
                  <img
                    src={displayAvatar}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageSelect}
                className="hidden"
              />

              <button
                type="button"
                onClick={handleChooseImage}
                disabled={
                  uploadingAvatar ||
                  removingAvatar
                }
                aria-label="Change profile photo"
                className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-xl border border-border/80 bg-surface text-muted shadow-sm outline-none transition-colors duration-200 hover:border-primary/20 hover:bg-primary-soft hover:text-primary focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Camera className="h-4 w-4" />
              </button>

              {selectedImage && (
                <button
                  type="button"
                  onClick={
                    handleCancelSelectedImage
                  }
                  disabled={uploadingAvatar}
                  aria-label="Cancel selected profile photo"
                  className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-lg border border-border/80 bg-surface text-muted shadow-sm outline-none transition-colors duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:ring-2 focus:ring-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="min-w-0 lg:text-center">
              <p className="text-base font-semibold text-foreground">
                {account?.name || "Munna"}
              </p>

              <div className="mt-1.5 inline-flex items-center rounded-full bg-primary-soft px-2.5 py-1">
                <span className="text-[11px] font-semibold text-primary">
                  Workspace Owner
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3 lg:justify-center">
                <button
                  type="button"
                  onClick={handleChooseImage}
                  disabled={
                    uploadingAvatar ||
                    removingAvatar
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors duration-200 hover:text-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ImagePlus className="h-3.5 w-3.5" />
                  Change photo
                </button>

                {account?.avatar && !selectedImage && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    disabled={
                      removingAvatar ||
                      uploadingAvatar
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-danger transition-colors duration-200 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {removingAvatar ? (
                      <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <X className="h-3.5 w-3.5" />
                    )}

                    {removingAvatar
                      ? "Removing..."
                      : "Remove photo"}
                  </button>
                )}
              </div>

              <p className="mt-1 text-[11px] leading-5 text-muted">
                JPG, PNG or WebP · Max 5 MB
              </p>

              {imageError && (
                <p className="mt-2 max-w-[190px] text-xs font-medium leading-5 text-danger lg:mx-auto">
                  {imageError}
                </p>
              )}

              {selectedImage && (
                <div className="mt-3 space-y-2">
                  <p className="max-w-[190px] text-xs font-medium leading-5 text-primary lg:mx-auto">
                    {selectedImage.name}
                  </p>

                  <button
                    type="button"
                    onClick={handleUploadAvatar}
                    disabled={uploadingAvatar}
                    className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3.5 text-xs font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {uploadingAvatar ? (
                      <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Camera className="h-3.5 w-3.5" />
                    )}

                    {uploadingAvatar
                      ? "Uploading..."
                      : "Upload photo"}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid flex-1 gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="full-name"
                className="text-sm font-semibold text-foreground"
              >
                Full name
              </label>

              <div className="relative mt-2">
                <UserRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

                <input
                  id="full-name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  className="h-11 w-full rounded-xl border border-border/80 bg-surface pl-10 pr-4 text-sm text-foreground outline-none transition-colors duration-200 placeholder:text-muted hover:border-border focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="text-sm font-semibold text-foreground"
              >
                Email address
              </label>

              <div className="relative mt-2">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  className="h-11 w-full rounded-xl border border-border/80 bg-surface pl-10 pr-4 text-sm text-foreground outline-none transition-colors duration-200 placeholder:text-muted hover:border-border focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="role"
                className="text-sm font-semibold text-foreground"
              >
                Role
              </label>

              <div className="relative mt-2">
                <ShieldCheck className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

                <input
                  id="role"
                  type="text"
                  value="Owner"
                  readOnly
                  className="h-11 w-full cursor-not-allowed rounded-xl border border-border/70 bg-background pl-10 pr-4 text-sm font-medium text-muted outline-none"
                />
              </div>

              <p className="mt-1.5 text-xs leading-5 text-muted">
                Your role is controlled by workspace permissions.
              </p>
            </div>

            <div>
              <label
                htmlFor="timezone"
                className="text-sm font-semibold text-foreground"
              >
                Timezone
              </label>

              <select
                id="timezone"
                value={timezone}
                onChange={(event) =>
                  setTimezone(event.target.value)
                }
                className="mt-2 h-11 w-full rounded-xl border border-border/80 bg-surface px-4 text-sm text-foreground outline-none transition-colors duration-200 hover:border-border focus:border-primary focus:ring-4 focus:ring-primary/10"
              >
                {TIMEZONE_OPTIONS.map(
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

              <p className="mt-1.5 text-xs leading-5 text-muted">
                Used for follow-ups, activity timestamps, and reminders.
              </p>
            </div>

            <div className="flex justify-end border-t border-border/70 pt-5 md:col-span-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={
                  saving ||
                  uploadingAvatar ||
                  removingAvatar
                }
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
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
          </div>
        </div>
      </div>
    </section>
  );
}

