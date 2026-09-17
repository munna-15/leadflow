"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { register } from "@/services/auth.service";

type FormErrors = {
  name?: string;
  businessName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
};

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    businessName: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (form.name.trim().length < 2) {
      nextErrors.name = "Name must be at least 2 characters";
    }

    if (form.businessName.trim().length < 2) {
      nextErrors.businessName = "Business name must be at least 2 characters";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Please provide a valid email address";
    }

    if (form.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters";
    }

    if (form.confirmPassword.length < 8) {
      nextErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
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
      await register({
        name: form.name.trim(),
        businessName: form.businessName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      router.push("/auth/login");
    } catch (error: any) {
      const responseData = error?.response?.data;

      if (Array.isArray(responseData?.errors)) {
        const fieldErrors: FormErrors = {};

        responseData.errors.forEach(
          (error: { field?: string; message?: string }) => {
            if (error.field && error.field in form) {
              fieldErrors[error.field as keyof FormErrors] = error.message;
            }
          },
        );

        if (Object.keys(fieldErrors).length > 0) {
          setErrors(fieldErrors);
        } else {
          setErrors({
            form: responseData.message || "Registration failed",
          });
        }
      } else {
        setErrors({
          form: responseData?.message || "Registration failed",
        });
      }
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
              Build a better system for every{" "}
              <span className="bg-linear-to-r from-[#111827] via-[#334155] to-[#0EA5E9] bg-clip-text text-transparent">
                opportunity.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-body">
              Capture leads, understand intent, organize your sales workflow,
              and follow up before valuable opportunities disappear.
            </p>

            <div className="mt-8 space-y-3">
              {[
                "Centralize every lead in one place",
                "Turn conversations into useful lead intelligence",
                "Never lose track of the next follow-up",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />

                  <span className="text-sm font-medium text-body">{item}</span>
                </div>
              ))}
            </div>
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
                  Create your{" "}
                  <span className="bg-linear-to-r from-[#111827] via-[#334155] to-[#0EA5E9] bg-clip-text text-transparent">
                    workspace.
                  </span>
                </h2>

                <p className="mt-3 text-sm leading-6 text-muted">
                  Start organizing your leads and building a smarter sales
                  workflow.
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
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Full name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    placeholder="Your name"
                    disabled={isSubmitting}
                    className={`h-11 w-full rounded-xl border bg-background px-4 text-sm text-foreground outline-none transition placeholder:text-muted/70 focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60 ${
                      errors.name
                        ? "border-danger focus:border-danger"
                        : "border-border focus:border-primary"
                    }`}
                  />

                  {errors.name && (
                    <p className="mt-1.5 text-xs font-medium text-danger">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="businessName"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Business name
                  </label>

                  <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    autoComplete="organization"
                    value={form.businessName}
                    onChange={(event) =>
                      updateField("businessName", event.target.value)
                    }
                    placeholder="Your business"
                    disabled={isSubmitting}
                    className={`h-11 w-full rounded-xl border bg-background px-4 text-sm text-foreground outline-none transition placeholder:text-muted/70 focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60 ${
                      errors.businessName
                        ? "border-danger focus:border-danger"
                        : "border-border focus:border-primary"
                    }`}
                  />

                  {errors.businessName && (
                    <p className="mt-1.5 text-xs font-medium text-danger">
                      {errors.businessName}
                    </p>
                  )}
                </div>

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
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={form.password}
                      onChange={(event) =>
                        updateField("password", event.target.value)
                      }
                      placeholder="Create a password"
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

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Confirm password
                  </label>

                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={form.confirmPassword}
                      onChange={(event) =>
                        updateField("confirmPassword", event.target.value)
                      }
                      placeholder="Repeat your password"
                      disabled={isSubmitting}
                      className={`h-11 w-full rounded-xl border bg-background px-4 pr-11 text-sm text-foreground outline-none transition placeholder:text-muted/70 focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60 ${
                        errors.confirmPassword
                          ? "border-danger focus:border-danger"
                          : "border-border focus:border-primary"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((value) => !value)}
                      disabled={isSubmitting}
                      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted transition-colors hover:bg-primary-soft hover:text-primary disabled:cursor-not-allowed"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {errors.confirmPassword && (
                    <p className="mt-1.5 text-xs font-medium text-danger">
                      {errors.confirmPassword}
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
                      Creating workspace...
                    </>
                  ) : (
                    <>
                      Create workspace
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-muted">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-semibold text-primary transition-colors hover:text-primary-dark"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-muted">
              By creating an account, you agree to use LeadFlow responsibly and
              keep your account credentials secure.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
