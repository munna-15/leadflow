const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const getSafeUrl = (value) => {
  const url = String(value || "").trim();

  if (!url) {
    return null;
  }

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return null;
    }

    return parsedUrl.toString();
  } catch {
    return null;
  }
};

const formatDateTime = (value) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: process.env.INVITATION_DISPLAY_TIMEZONE || "Asia/Dhaka",
  }).format(date);
};

const renderValue = (value) => {
  const normalized = String(value || "").trim();

  return normalized ? escapeHtml(normalized) : "Not provided";
};

const renderNeeds = (needs = []) => {
  if (!Array.isArray(needs) || needs.length === 0) {
    return `
      <span
        style="
          display:inline-block;
          padding:8px 11px;
          border-radius:999px;
          background:#f3f4f6;
          color:#6b7280;
          font-size:12px;
          line-height:1;
          font-weight:600;
        "
      >
        No specific need selected
      </span>
    `;
  }

  return needs
    .map(
      (need) => `
        <span
          style="
            display:inline-block;
            margin:0 6px 6px 0;
            padding:8px 11px;
            border-radius:999px;
            background:#ecfeff;
            border:1px solid #cffafe;
            color:#0369a1;
            font-size:12px;
            line-height:1;
            font-weight:700;
          "
        >
          ${escapeHtml(need)}
        </span>
      `,
    )
    .join("");
};

const renderWebsite = (website) => {
  const normalized = String(website || "").trim();

  if (!normalized) {
    return "Not provided";
  }

  const safeUrl = getSafeUrl(normalized);

  if (!safeUrl) {
    return escapeHtml(normalized);
  }

  return `
    <a
      href="${escapeHtml(safeUrl)}"
      target="_blank"
      style="
        color:#0284c7;
        text-decoration:none;
        font-weight:700;
      "
    >
      ${escapeHtml(normalized)}
    </a>
  `;
};

const renderField = (label, value) => `
  <tr>
    <td
      style="
        padding:13px 0;
        border-bottom:1px solid #eef2f7;
        width:36%;
        vertical-align:top;
      "
    >
      <span
        style="
          display:block;
          color:#94a3b8;
          font-size:11px;
          line-height:16px;
          font-weight:700;
          text-transform:uppercase;
          letter-spacing:0.08em;
        "
      >
        ${escapeHtml(label)}
      </span>
    </td>

    <td
      style="
        padding:13px 0;
        border-bottom:1px solid #eef2f7;
        vertical-align:top;
      "
    >
      <span
        style="
          color:#0f172a;
          font-size:14px;
          line-height:22px;
          font-weight:600;
        "
      >
        ${value}
      </span>
    </td>
  </tr>
`;

export const buildGetStartedEmailHtml = (inquiry) => {
  const firstName =
    String(inquiry.name || "there")
      .trim()
      .split(/\s+/)[0] || "there";

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>New LeadFlow Inquiry</title>
  </head>

  <body
    style="
      margin:0;
      padding:0;
      background:#f3f6fa;
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
      color:#0f172a;
    "
  >
    <div
      style="
        width:100%;
        padding:36px 18px;
        box-sizing:border-box;
      "
    >
      <table
        role="presentation"
        cellpadding="0"
        cellspacing="0"
        border="0"
        width="100%"
        style="
          max-width:700px;
          margin:0 auto;
        "
      >
        <tr>
          <td>
            <table
              role="presentation"
              cellpadding="0"
              cellspacing="0"
              border="0"
              width="100%"
              style="
                background:#08152d;
                border-radius:20px 20px 0 0;
                overflow:hidden;
              "
            >
              <tr>
                <td
                  style="
                    padding:28px 30px;
                  "
                >
                  <div
                    style="
                      display:inline-block;
                      width:10px;
                      height:10px;
                      border-radius:50%;
                      background:#38bdf8;
                      margin-right:8px;
                      vertical-align:middle;
                    "
                  ></div>

                  <span
                    style="
                      color:#ffffff;
                      font-size:13px;
                      line-height:18px;
                      font-weight:800;
                      letter-spacing:0.12em;
                      text-transform:uppercase;
                    "
                  >
                    LeadFlow
                  </span>

                  <div
                    style="
                      margin-top:25px;
                      color:#93c5fd;
                      font-size:11px;
                      line-height:16px;
                      font-weight:700;
                      letter-spacing:0.12em;
                      text-transform:uppercase;
                    "
                  >
                    New consultation request
                  </div>

                  <div
                    style="
                      margin-top:8px;
                      color:#ffffff;
                      font-size:29px;
                      line-height:36px;
                      font-weight:800;
                      letter-spacing:-0.03em;
                    "
                  >
                    A new business inquiry just arrived.
                  </div>

                  <div
                    style="
                      margin-top:10px;
                      max-width:540px;
                      color:#cbd5e1;
                      font-size:14px;
                      line-height:22px;
                    "
                  >
                    ${escapeHtml(firstName)}
                    submitted the LeadFlow Get Started form.
                  </div>
                </td>
              </tr>
            </table>

            <table
              role="presentation"
              cellpadding="0"
              cellspacing="0"
              border="0"
              width="100%"
              style="
                background:#ffffff;
                border:1px solid #e5eaf0;
                border-top:none;
              "
            >
              <tr>
                <td
                  style="
                    padding:30px;
                  "
                >
                  <div
                    style="
                      padding:18px 20px;
                      border:1px solid #dbeafe;
                      border-radius:16px;
                      background:#f8fbff;
                    "
                  >
                    <div
                      style="
                        color:#64748b;
                        font-size:10px;
                        line-height:15px;
                        font-weight:800;
                        text-transform:uppercase;
                        letter-spacing:0.12em;
                      "
                    >
                      Business
                    </div>

                    <div
                      style="
                        margin-top:5px;
                        color:#0f172a;
                        font-size:20px;
                        line-height:28px;
                        font-weight:800;
                        letter-spacing:-0.02em;
                      "
                    >
                      ${renderValue(inquiry.businessName)}
                    </div>

                    <div
                      style="
                        margin-top:5px;
                        color:#64748b;
                        font-size:13px;
                        line-height:20px;
                      "
                    >
                      Submitted ${escapeHtml(formatDateTime(inquiry.createdAt))}
                    </div>
                  </div>

                  <div
                    style="
                      margin-top:28px;
                      color:#0f172a;
                      font-size:15px;
                      line-height:22px;
                      font-weight:800;
                    "
                  >
                    Contact & business details
                  </div>

                  <table
                    role="presentation"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    width="100%"
                    style="
                      margin-top:8px;
                    "
                  >
                    ${renderField("Name", renderValue(inquiry.name))}

                    ${renderField(
                      "Email",
                      `
                        <a
                          href="mailto:${escapeHtml(inquiry.email)}"
                          style="
                            color:#0284c7;
                            text-decoration:none;
                            font-weight:700;
                          "
                        >
                          ${escapeHtml(inquiry.email)}
                        </a>
                      `,
                    )}

                    ${renderField(
                      "Business type",
                      renderValue(inquiry.businessType),
                    )}

                    ${renderField("Website", renderWebsite(inquiry.website))}

                    ${renderField("Team size", renderValue(inquiry.teamSize))}

                    ${renderField(
                      "Monthly lead volume",
                      renderValue(inquiry.leadVolume),
                    )}
                  </table>

                  <div
                    style="
                      margin-top:30px;
                      color:#0f172a;
                      font-size:15px;
                      line-height:22px;
                      font-weight:800;
                    "
                  >
                    Areas they are looking for
                  </div>

                  <div
                    style="
                      margin-top:12px;
                      line-height:0;
                    "
                  >
                    ${renderNeeds(inquiry.needs)}
                  </div>

                  <div
                    style="
                      margin-top:30px;
                      color:#0f172a;
                      font-size:15px;
                      line-height:22px;
                      font-weight:800;
                    "
                  >
                    Message
                  </div>

                  <div
                    style="
                      margin-top:12px;
                      padding:18px;
                      border-radius:14px;
                      background:#f8fafc;
                      border:1px solid #e2e8f0;
                      color:#334155;
                      font-size:14px;
                      line-height:24px;
                      white-space:pre-wrap;
                    "
                  >
                    ${renderValue(inquiry.message)}
                  </div>

                  <div
                    style="
                      margin-top:30px;
                      padding:17px 18px;
                      border-radius:14px;
                      background:#ecfdf5;
                      border:1px solid #bbf7d0;
                    "
                  >
                    <div
                      style="
                        color:#166534;
                        font-size:12px;
                        line-height:18px;
                        font-weight:800;
                      "
                    >
                      Ready to respond
                    </div>

                    <div
                      style="
                        margin-top:4px;
                        color:#365314;
                        font-size:13px;
                        line-height:20px;
                      "
                    >
                      Reply to this email and your response will
                      be addressed to the submitted client email.
                    </div>
                  </div>
                </td>
              </tr>
            </table>

            <table
              role="presentation"
              cellpadding="0"
              cellspacing="0"
              border="0"
              width="100%"
              style="
                background:#08152d;
                border-radius:0 0 20px 20px;
              "
            >
              <tr>
                <td
                  style="
                    padding:22px 30px;
                  "
                >
                  <div
                    style="
                      color:#94a3b8;
                      font-size:11px;
                      line-height:18px;
                    "
                  >
                    LeadFlow private platform notification
                  </div>

                  <div
                    style="
                      margin-top:4px;
                      color:#64748b;
                      font-size:10px;
                      line-height:16px;
                    "
                  >
                    This notification was generated from the public
                    Get Started form.
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>
`;
};

export const buildGetStartedEmailText = (inquiry) => {
  return [
    "New LeadFlow consultation request",
    "",
    `Business: ${inquiry.businessName || "Not provided"}`,
    `Name: ${inquiry.name || "Not provided"}`,
    `Email: ${inquiry.email || "Not provided"}`,
    `Business type: ${inquiry.businessType || "Not provided"}`,
    `Website: ${inquiry.website || "Not provided"}`,
    `Team size: ${inquiry.teamSize || "Not provided"}`,
    `Monthly lead volume: ${inquiry.leadVolume || "Not provided"}`,
    `Needs: ${
      Array.isArray(inquiry.needs) && inquiry.needs.length
        ? inquiry.needs.join(", ")
        : "None selected"
    }`,
    "",
    "Message:",
    inquiry.message || "Not provided",
    "",
    `Submitted: ${formatDateTime(inquiry.createdAt)}`,
    "",
    "Reply to this email to respond directly to the client.",
  ].join("\n");
};
