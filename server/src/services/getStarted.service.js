import { Resend } from "resend";

import GetStartedInquiry from "../models/getStartedInquiry.model.js";

import AppError from "../utils/AppError.js";

import {
  buildGetStartedEmailHtml,
  buildGetStartedEmailText,
} from "../emails/getStarted.email.js";

const normalizeEmail = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const normalizeString = (value) => {
  const normalized = String(value || "").trim();

  return normalized || null;
};

const getRequiredConfig = () => {
  const apiKey = String(process.env.RESEND_API_KEY || "").trim();

  const fromEmail = String(process.env.MAIL_FROM || "").trim();

  const notificationEmail = normalizeEmail(process.env.PLATFORM_OWNER_EMAIL);

  if (!apiKey) {
    throw new AppError(
      "Email delivery is not configured. RESEND_API_KEY is missing.",
      503,
    );
  }

  if (!fromEmail) {
    throw new AppError(
      "Email delivery is not configured. MAIL_FROM is missing.",
      503,
    );
  }

  if (!notificationEmail) {
    throw new AppError(
      "Get Started notification recipient is not configured.",
      503,
    );
  }

  return {
    apiKey,
    fromEmail,
    notificationEmail,
  };
};

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const saveEmailFailure = async (inquiry, errorMessage) => {
  inquiry.emailDelivered = false;
  inquiry.emailId = null;
  inquiry.emailError = String(errorMessage || "Email delivery failed.").slice(
    0,
    1000,
  );

  await inquiry.save();
};

export const submitGetStartedInquiry = async (payload = {}) => {
  const name = String(payload.name || "").trim();

  const businessName = String(payload.businessName || "").trim();

  const email = normalizeEmail(payload.email);

  const businessType = normalizeString(payload.businessType);

  const website = normalizeString(payload.website);

  const teamSize = normalizeString(payload.teamSize);

  const leadVolume = normalizeString(payload.leadVolume);

  const message = String(payload.message || "").trim();

  const needs = Array.isArray(payload.needs)
    ? [
        ...new Set(
          payload.needs
            .map((item) => String(item || "").trim())
            .filter(Boolean),
        ),
      ]
    : [];

  if (!name) {
    throw new AppError("Your name is required.", 400);
  }

  if (!businessName) {
    throw new AppError("Business name is required.", 400);
  }

  if (!email || !isValidEmail(email)) {
    throw new AppError("A valid work email is required.", 400);
  }

  if (!message) {
    throw new AppError("Please tell us about your situation.", 400);
  }

  if (name.length > 120) {
    throw new AppError("Name is too long.", 400);
  }

  if (businessName.length > 160) {
    throw new AppError("Business name is too long.", 400);
  }

  if (email.length > 254) {
    throw new AppError("Email address is too long.", 400);
  }

  if (businessType && businessType.length > 120) {
    throw new AppError("Business type is too long.", 400);
  }

  if (website && website.length > 300) {
    throw new AppError("Website address is too long.", 400);
  }

  if (teamSize && teamSize.length > 120) {
    throw new AppError("Team size value is too long.", 400);
  }

  if (leadVolume && leadVolume.length > 120) {
    throw new AppError("Lead volume value is too long.", 400);
  }

  if (message.length > 5000) {
    throw new AppError("Message is too long.", 400);
  }

  if (needs.length > 20) {
    throw new AppError("Too many service needs were selected.", 400);
  }

  const inquiry = await GetStartedInquiry.create({
    name,
    businessName,
    email,
    businessType,
    website,
    teamSize,
    leadVolume,
    needs,
    message,
    source: "get_started",
    status: "new",
  });

  try {
    const { apiKey, fromEmail, notificationEmail } = getRequiredConfig();

    const resend = new Resend(apiKey);

    const subjectBusinessName = businessName || "New business";

    const { data, error } = await resend.emails.send(
      {
        from: fromEmail,
        to: [notificationEmail],
        replyTo: email,
        subject: `New LeadFlow inquiry — ${subjectBusinessName}`,
        html: buildGetStartedEmailHtml(inquiry),
        text: buildGetStartedEmailText(inquiry),
      },
      {
        idempotencyKey: `get-started/${inquiry._id.toString()}`,
      },
    );

    if (error) {
      await saveEmailFailure(
        inquiry,
        error.message || error.error || "Email delivery failed.",
      );

      throw new AppError(
        "Your request was saved, but the notification email could not be delivered yet.",
        503,
      );
    }

    if (!data?.id) {
      await saveEmailFailure(inquiry, "Email provider returned no message ID.");

      throw new AppError(
        "Your request was saved, but the notification email could not be confirmed.",
        503,
      );
    }

    inquiry.emailDelivered = true;
    inquiry.emailId = data.id;
    inquiry.emailError = null;

    await inquiry.save();

    return {
      id: inquiry._id.toString(),
      createdAt: inquiry.createdAt,
      status: inquiry.status,
      emailDelivered: inquiry.emailDelivered,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    await saveEmailFailure(inquiry, error?.message || "Email delivery failed.");

    throw new AppError(
      "Your request was saved, but the notification email could not be delivered yet.",
      503,
    );
  }
};
