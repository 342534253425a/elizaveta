import type { Metadata } from "next";
import { BookingFlow } from "@/components/booking-flow";

export const metadata: Metadata = {
  title: "Запись",
  description: "Выберите формат консультации, удобный день и оставьте короткий запрос.",
};

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ format?: string; topic?: string }>;
}) {
  const params = await searchParams;
  return <BookingFlow initialFormat={params.format} initialTopic={params.topic} />;
}
