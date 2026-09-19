const RESEND_API_URL = "https://api.resend.com/emails";

const normalizeValue = (value) => String(value || "").trim();

const getRequiredEnv = (name) => {
  const value = normalizeValue(process.env[name]);

  if (!value) {
    throw new Error(`${name} is not configured`);
  }

  return value;
};

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const formatExpiryDate = (date) => {
  const timezone =
    normalizeValue(process.env.INVITATION_DISPLAY_TIMEZONE) || "Asia/Dhaka";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: timezone,
  }).format(new Date(date));
};

const buildInvitationHtml = ({
  clientName,
  businessName,
  invitationUrl,
  expiresAt,
}) => {
  const safeClientName = escapeHtml(clientName);
  const safeBusinessName = escapeHtml(businessName);
  const safeInvitationUrl = escapeHtml(invitationUrl);
  const safeExpiryDate = escapeHtml(formatExpiryDate(expiresAt));

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>Your LeadFlow workspace is ready</title>
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      background: #f7f8fa;
      color: #111827;
      font-family: Arial, Helvetica, sans-serif;
    "
  >
    <table
      role="presentation"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      border="0"
      style="background: #f7f8fa; padding: 40px 16px;"
    >
      <tr>
        <td align="center">
          <table
            role="presentation"
            width="100%"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="
              max-width: 600px;
              background: #ffffff;
              border: 1px solid #e5e7eb;
              border-radius: 20px;
              overflow: hidden;
            "
          >
            <tr>
              <td style="padding: 32px 32px 20px;">
                <div
                  style="
                    display: inline-block;
                    padding: 7px 12px;
                    border-radius: 999px;
                    background: #e0f2fe;
                    color: #0284c7;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 0.04em;
                  "
                >
                  LEADFLOW
                </div>

                <h1
                  style="
                    margin: 24px 0 12px;
                    font-size: 30px;
                    line-height: 1.2;
                    color: #111827;
                  "
                >
                  Your workspace is ready
                </h1>

                <p
                  style="
                    margin: 0;
                    font-size: 16px;
                    line-height: 1.7;
                    color: #374151;
                  "
                >
                  Hi ${safeClientName},
                </p>

                <p
                  style="
                    margin: 14px 0 0;
                    font-size: 16px;
                    line-height: 1.7;
                    color: #374151;
                  "
                >
                  Your LeadFlow workspace for
                  <strong>${safeBusinessName}</strong>
                  has been created.
                </p>

                <p
                  style="
                    margin: 14px 0 0;
                    font-size: 16px;
                    line-height: 1.7;
                    color: #374151;
                  "
                >
                  Use the button below to activate your account and
                  create your password.
                </p>

                <div style="margin: 28px 0;">
                  <a
                    href="${safeInvitationUrl}"
                    style="
                      display: inline-block;
                      padding: 14px 22px;
                      border-radius: 12px;
                      background: #0ea5e9;
                      color: #ffffff;
                      font-size: 15px;
                      font-weight: 700;
                      text-decoration: none;
                    "
                  >
                    Activate LeadFlow
                  </a>
                </div>

                <p
                  style="
                    margin: 0;
                    font-size: 14px;
                    line-height: 1.6;
                    color: #6b7280;
                  "
                >
                  This invitation expires on
                  <strong>${safeExpiryDate}</strong>.
                </p>

                <p
                  style="
                    margin: 20px 0 0;
                    font-size: 13px;
                    line-height: 1.6;
                    color: #9ca3af;
                  "
                >
                  For security, this invitation link is intended only
                  for the recipient of this email.
                </p>
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 20px 32px 28px;
                  border-top: 1px solid #f3f4f6;
                "
              >
                <p
                  style="
                    margin: 0;
                    font-size: 12px;
                    line-height: 1.6;
                    color: #9ca3af;
                  "
                >
                  If the button does not work, copy and paste this link
                  into your browser:
                </p>

                <p
                  style="
                    margin: 8px 0 0;
                    font-size: 12px;
                    line-height: 1.6;
                    word-break: break-all;
                    color: #6b7280;
                  "
                >
                  ${safeInvitationUrl}
                </p>
              </td>
            </tr>
          </table>

          <p
            style="
              max-width: 600px;
              margin: 18px auto 0;
              font-size: 12px;
              line-height: 1.6;
              text-align: center;
              color: #9ca3af;
            "
          >
            LeadFlow · AI-powered lead management and follow-up
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
};

const buildInvitationText = ({
  clientName,
  businessName,
  invitationUrl,
  expiresAt,
}) => {
  return [
    `Hi ${clientName},`,
    "",
    `Your LeadFlow workspace for ${businessName} has been created.`,
    "",
    "Activate your account and create your password using this link:",
    invitationUrl,
    "",
    `This invitation expires on ${formatExpiryDate(expiresAt)}.`,
    "",
    "For security, this invitation link is intended only for the recipient of this email.",
    "",
    "LeadFlow",
  ].join("\n");
};

export const sendLeadFlowInvitationEmail = async ({
  invitationId,
  email,
  clientName,
  businessName,
  invitationUrl,
  expiresAt,
}) => {
  if (!invitationId) {
    throw new Error("Invitation ID is required");
  }

  if (!email) {
    throw new Error("Recipient email is required");
  }

  if (!clientName) {
    throw new Error("Client name is required");
  }

  if (!businessName) {
    throw new Error("Business name is required");
  }

  if (!invitationUrl) {
    throw new Error("Invitation URL is required");
  }

  if (!expiresAt) {
    throw new Error("Invitation expiry is required");
  }

  const apiKey = getRequiredEnv("RESEND_API_KEY");
  const from = getRequiredEnv("MAIL_FROM");

  const subject = `${businessName} — Your LeadFlow workspace is ready`;

  const payload = {
    from,
    to: [email],
    subject,
    html: buildInvitationHtml({
      clientName,
      businessName,
      invitationUrl,
      expiresAt,
    }),
    text: buildInvitationText({
      clientName,
      businessName,
      invitationUrl,
      expiresAt,
    }),
  };

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `client-invitation/${invitationId}`,
    },
    body: JSON.stringify(payload),
  });

  let responseData = null;

  try {
    responseData = await response.json();
  } catch {
    responseData = null;
  }

  if (!response.ok) {
    const providerMessage =
      responseData?.message ||
      responseData?.error ||
      "Email provider rejected the request";

    const error = new Error(providerMessage);

    error.statusCode = response.status;
    error.provider = "resend";
    error.providerResponse = responseData;

    throw error;
  }

  return {
    emailId: responseData?.id || null,
  };
};
