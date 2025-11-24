type SendContactEmailParams = {
  to: string;
  subject: string;
  text: string;
};

/**
 * 実際のメール送信処理をカプセル化する関数。
 *
 * - 本番環境では SMTP やメール配信サービス経由で送信する想定
 * - まだ認証情報を設定していない場合は、エラーではなくログ出力のみ行う
 *
 * NOTE:
 * - プロジェクトに最適なプロバイダ（Resend / SendGrid / SES など）が決まり次第、
 *   この関数内の実装を差し替える
 */
export async function sendContactEmail({
  to,
  subject,
  text,
}: SendContactEmailParams): Promise<void> {
  const provider = process.env.CONTACT_EMAIL_PROVIDER ?? "log-only";

  if (provider === "log-only") {
    // セキュリティ上、本文全体はログに出さない
    console.info("[ContactEmail] log-only mode", {
      to,
      subject,
      textPreview: text.slice(0, 200),
    });
    return;
  }

  // ここに実際のメール送信実装を追加する
  // 例: Resend / nodemailer / SendGrid など
  throw new Error(
    `CONTACT_EMAIL_PROVIDER=${provider} の実装がまだ追加されていません。sendContactEmail を更新してください。`
  );
}
