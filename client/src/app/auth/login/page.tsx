"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowRight, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type FormErrors = {
  email?: string;
  password?: string;
  form?: string;
};

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
      form: undefined,
    }));
  };

  const validateForm = () => {
    const nextErrors: FormErrors = {};

    if (!form.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Please provide a valid email address";
    }

    if (!form.password) {
      nextErrors.password = "Password is required";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrors({
          form: result.message || "Unable to sign in",
        });

        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setErrors({
        form: "Unable to connect to LeadFlow. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden flex-col justify-between px-10 py-10 lg:flex xl:px-16">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white shadow-sm">
              L
            </span>

            <span className="text-lg font-semibold tracking-tight text-foreground">
              LeadFlow
            </span>
          </Link>

          <div className="max-w-xl pb-16">
            <span className="mb-6 inline-flex items-center rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-muted shadow-sm">
              AI-powered lead management
            </span>

            <h1 className="text-5xl font-semibold leading-[1.06] tracking-tight text-foreground xl:text-6xl">
              Turn every lead into a{" "}
              <span className="bg-linear-to-r from-[#111827] via-[#334155] to-[#0EA5E9] bg-clip-text text-transparent">
                meaningful opportunity.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-body">
              Keep your sales workflow focused, organized, and ready for the
              next opportunity.
            </p>
          </div>

          <p className="text-xs text-muted">
            © {new Date().getFullYear()} LeadFlow. All rights reserved.
          </p>
        </section>

        <section className="flex min-h-screen items-center justify-center px-6 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Link href="/" className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white shadow-sm">
                  L
                </span>

                <span className="text-lg font-semibold tracking-tight text-foreground">
                  LeadFlow
                </span>
              </Link>
            </div>

            <div className="rounded-3xl border border-border bg-surface p-7 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-9">
              <div>
                <h2 className="text-3xl font-semibold leading-tight tracking-tight text-foreground">
                  Welcome{" "}
                  <span className="bg-linear-to-r from-[#111827] via-[#334155] to-[#0EA5E9] bg-clip-text text-transparent">
                    back.
                  </span>
                </h2>

                <p className="mt-3 text-sm leading-6 text-muted">
                  Sign in to continue managing your leads and sales workflow.
                </p>
              </div>

              {errors.form && (
                <div className="mt-6 rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm font-medium text-danger">
                  {errors.form}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
                noValidate
              >
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    placeholder="you@company.com"
                    disabled={isSubmitting}
                    className={`h-11 w-full rounded-xl border bg-background px-4 text-sm text-foreground outline-none transition placeholder:text-muted/70 focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60 ${
                      errors.email
                        ? "border-danger focus:border-danger"
                        : "border-border focus:border-primary"
                    }`}
                  />

                  {errors.email && (
                    <p className="mt-1.5 text-xs font-medium text-danger">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-foreground"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-xs font-semibold text-primary transition-colors hover:text-primary-dark"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={form.password}
                      onChange={(event) =>
                        updateField("password", event.target.value)
                      }
                      placeholder="Enter your password"
                      disabled={isSubmitting}
                      className={`h-11 w-full rounded-xl border bg-background px-4 pr-11 text-sm text-foreground outline-none transition placeholder:text-muted/70 focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60 ${
                        errors.password
                          ? "border-danger focus:border-danger"
                          : "border-border focus:border-primary"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      disabled={isSubmitting}
                      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted transition-colors hover:bg-primary-soft hover:text-primary disabled:cursor-not-allowed"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="mt-1.5 text-xs font-medium text-danger">
                      {errors.password}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-muted">
                Don't have an account?{" "}
                <Link
                  href="/auth/register"
                  className="font-semibold text-primary transition-colors hover:text-primary-dark"
                >
                  Create one
                </Link>
              </p>
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-muted">
              Your account is protected with secure authentication.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
