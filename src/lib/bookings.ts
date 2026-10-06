import { promises as fs } from "fs";
import path from "path";
import { formatById, topicById } from "./content";
import type { BookingInput } from "./schema";
import { addMonthsISO, isRealDate, isSlotBookable, isTimeSlot, moscowDateISO, shiftISO, slotKey } from "./schedule";

export type StoredBooking = BookingInput & {
  id: string;
  createdAt: string;
  seed?: boolean;
};

const filePath = path.join(process.cwd(), "data", "bookings.json");

function seedBookings(): StoredBooking[] {
  const today = moscowDateISO();
  const samples: Array<[number, string, string]> = [
    [3, "11:00", "short"],
    [6, "16:00", "single"],
    [9, "15:00", "intro"],
    [12, "10:00", "family"],
    [16, "18:00", "pack"],
    [19, "12:00", "typing"],
  ];

  return samples.map(([days, time, formatId], index) => ({
    id: `EL-SEED${index + 1}`,
    formatId,
    date: shiftISO(today, days),
    time,
    name: "Занято",
    email: "seed@local",
    contact: "—",
    message: "Служебная запись, чтобы в календаре были занятые окна.",
    consent: true,
    createdAt: new Date().toISOString(),
    seed: true,
  }));
}

let queue: Promise<unknown> = Promise.resolve();
let memory: StoredBooking[] | null = null;

function withLock<T>(task: () => Promise<T>) {
  const run = queue.then(task, task);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function persist(bookings: StoredBooking[]) {
  memory = bookings;
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(bookings, null, 2), "utf8");
  } catch (error) {
    console.error("Не удалось записать заявки на диск, оставляю их в памяти процесса.", error);
  }
}

export async function readBookings() {
  if (memory) return memory;
  try {
    const raw = await fs.readFile(filePath, "utf8");
    memory = JSON.parse(raw) as StoredBooking[];
  } catch {
    memory = seedBookings();
    await persist(memory);
  }
  return memory;
}

export async function createBooking(input: BookingInput) {
  return withLock(async () => {
    const format = formatById(input.formatId);
    if (!format) {
      return { ok: false as const, status: 400, message: "Выберите формат консультации." };
    }
    if (!isRealDate(input.date) || !isTimeSlot(input.time) || !isSlotBookable(input.date, input.time)) {
      return { ok: false as const, status: 400, message: "Это время уже нельзя выбрать. Посмотрите другие окна." };
    }
    if (input.date > addMonthsISO(moscowDateISO(), 4)) {
      return { ok: false as const, status: 400, message: "Запись открыта на ближайшие четыре месяца." };
    }
    if (input.topicId && input.topicId !== "other" && !topicById(input.topicId)) {
      return { ok: false as const, status: 400, message: "Не получилось сохранить тему. Отправьте заявку ещё раз." };
    }

    const bookings = await readBookings();
    const key = slotKey(input.date, input.time);
    if (bookings.some((booking) => slotKey(booking.date, booking.time) === key)) {
      return { ok: false as const, status: 409, message: "Это окно только что заняли. Выберите другое время." };
    }

    const booking: StoredBooking = {
      ...input,
      topicId: input.topicId || undefined,
      id: `EL-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      createdAt: new Date().toISOString(),
    };
    bookings.push(booking);
    await persist(bookings);
    return { ok: true as const, booking };
  });
}
