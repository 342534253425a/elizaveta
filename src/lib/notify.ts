import { formatById, site, topicById } from "@/lib/content";
import { formatLongDate, formatPrice } from "@/lib/format";
import type { StoredBooking } from "@/lib/bookings";

export type MailResult = "sent" | "activation" | "failed";

function letter(booking: StoredBooking) {
  const format = formatById(booking.formatId);
  const topic =
    booking.topicId === "other"
      ? "Свой запрос"
      : booking.topicId
        ? topicById(booking.topicId)?.title.join(" ")
        : null;
  const when = `${formatLongDate(booking.date)}, ${booking.time}`;
  const price = format ? formatPrice(format.price) : "";
  const lines = [
    `Номер: ${booking.id}`,
    `Формат: ${format?.title ?? booking.formatId}${price ? ` (${price})` : ""}`,
    `Когда: ${when}`,
    topic ? `Тема: ${topic}` : "",
    `Имя: ${booking.name}`,
    `Почта клиента: ${booking.email}`,
    `Контакт: ${booking.contact}`,
    "",
    booking.message,
  ].filter((line) => line !== "");

  return {
    subject: `Новая запись ${booking.id} — ${booking.name}`,
    message: lines.join("\n"),
  };
}

function readResult(status: number, raw: string): MailResult {
  let data: { success?: string | boolean; message?: string } = {};
  try {
    data = JSON.parse(raw) as { success?: string | boolean; message?: string };
  } catch {
    data = {};
  }
  if (status >= 200 && status < 300 && (data.success === "true" || data.success === true)) {
    return "sent";
  }
  if (/activat/i.test(data.message ?? raw)) return "activation";
  return "failed";
}

async function sendResend(booking: StoredBooking) {
  const { subject, message } = letter(booking);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM ?? "Елизавета <onboarding@resend.dev>",
      to: [site.email],
      reply_to: booking.email,
      subject,
      text: message,
    }),
  });
  if (!response.ok) {
    const raw = await response.text();
    console.error("Resend не принял письмо.", response.status, raw.slice(0, 400));
    return "failed" as const;
  }
  return "sent" as const;
}

async function sendFormSubmit(booking: StoredBooking): Promise<MailResult> {
  const { subject, message } = letter(booking);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (typeof window === "undefined") {
    const origin = process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000";
    headers.Origin = origin;
    headers.Referer = `${origin}/`;
  }

  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(site.email)}`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      _subject: subject,
      _template: "box",
      _captcha: "false",
      _replyto: booking.email,
      name: booking.name,
      email: booking.email,
      message,
    }),
  });
  const raw = await response.text();
  const result = readResult(response.status, raw);
  if (result !== "sent") {
    console.error("FormSubmit не отправил письмо.", response.status, raw.slice(0, 400));
  }
  return result;
}

export async function notifyBooking(booking: StoredBooking): Promise<MailResult> {
  try {
    if (process.env.RESEND_API_KEY && typeof window === "undefined") {
      return await sendResend(booking);
    }
    return await sendFormSubmit(booking);
  } catch (error) {
    console.error("Письмо о заявке не ушло.", error);
    return "failed";
  }
}
