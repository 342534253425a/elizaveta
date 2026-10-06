import { z } from "zod";

export const detailsSchema = z.object({
  name: z.string().trim().min(2, "Напишите, как к вам обращаться").max(80, "Слишком длинное имя"),
  email: z.string().trim().email("Проверьте адрес почты"),
  contact: z
    .string()
    .trim()
    .min(5, "Оставьте телефон или мессенджер, чтобы я могла ответить")
    .max(80, "Слишком длинный контакт"),
  message: z
    .string()
    .trim()
    .min(8, "Пары фраз о запросе будет достаточно")
    .max(1200, "Сократите сообщение — так я точнее его прочитаю"),
  consent: z.boolean().refine((value) => value, "Поставьте галочку — так я могу ответить на заявку"),
});

export const bookingSchema = detailsSchema.extend({
  formatId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().min(4),
  topicId: z.string().optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;
export type DetailsInput = z.infer<typeof detailsSchema>;
