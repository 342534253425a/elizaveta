import { createBooking, readBookings } from "@/lib/bookings";
import { notifyBooking } from "@/lib/notify";
import { bookingSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  const bookings = await readBookings();
  return Response.json({
    taken: bookings.map((booking) => ({ date: booking.date, time: booking.time })),
  });
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, message: "Не получилось прочитать заявку." }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(payload);
  if (!parsed.success) {
    return Response.json(
      { ok: false, message: "Проверьте поля формы — чего-то не хватает." },
      { status: 400 },
    );
  }

  const result = await createBooking(parsed.data);
  if (!result.ok) {
    return Response.json({ ok: false, message: result.message }, { status: result.status });
  }

  const mail =
    process.env.RESEND_API_KEY ? await notifyBooking(result.booking) : ("failed" as const);

  return Response.json({
    ok: true,
    mail,
    booking: {
      id: result.booking.id,
      date: result.booking.date,
      time: result.booking.time,
      formatId: result.booking.formatId,
    },
  });
}
