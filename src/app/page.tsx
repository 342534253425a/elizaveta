import { AboutPreview } from "@/components/about-preview";
import { Contacts } from "@/components/contacts";
import { Hero } from "@/components/hero";
import { Process } from "@/components/process";
import { Reviews } from "@/components/reviews";
import { ScrollRail } from "@/components/scroll-rail";
import { Topics } from "@/components/topics";

export default function HomePage() {
  return (
    <main>
      <ScrollRail />
      <Hero />
      <AboutPreview />
      <Topics />
      <Process />
      <Reviews />
      <Contacts />
    </main>
  );
}
