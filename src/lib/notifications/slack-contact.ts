type SlackContactPayload = {
  entryId: string;
  subject: string;
  name: string;
  email: string;
  message: string;
};

const SLACK_WEBHOOK_ENV_KEY = "SLACK_CONTACT_WEBHOOK_URL";

export async function notifySlackContactMessage(
  payload: SlackContactPayload
): Promise<void> {
  const webhookUrl = process.env[SLACK_WEBHOOK_ENV_KEY];

  if (!webhookUrl) {
    // Slack 連携が未設定の場合は何もしない
    console.info(
      "[SlackContact] Webhook URL is not configured; skipping Slack notification."
    );
    return;
  }

  const preview =
    payload.message.length > 140
      ? `${payload.message.slice(0, 140)}…`
      : payload.message;

  const textLines = [
    `📩 *Atlas HP お問い合わせ受信*`,
    "",
    `*種別*: \`${payload.entryId}\``,
    `*件名*: ${payload.subject}`,
    `*名前*: ${payload.name}`,
    `*メール*: ${payload.email}`,
    "",
    "*概要*",
    preview || "_(本文なし)_",
  ];

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: textLines.join("\n"),
      }),
    });

    if (!response.ok) {
      console.error(
        "[SlackContact] Failed to send Slack notification",
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error(
      "[SlackContact] Error while sending Slack notification",
      error
    );
  }
}
