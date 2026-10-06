import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope, Marck_Script } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SmoothScroll } from "@/components/smooth-scroll";
import { site } from "@/lib/content";
import "./globals.css";

const sans = Manrope({
  subsets: ["cyrillic", "latin"],
  variable: "--font-manrope",
  display: "swap",
});

const display = Cormorant_Garamond({
  subsets: ["cyrillic", "latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const script = Marck_Script({
  subsets: ["cyrillic", "latin"],
  weight: "400",
  variable: "--font-marck",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: site.title,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    locale: "ru_RU",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f4eef2",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${sans.variable} ${display.variable} ${script.variable} antialiased`}>
      <body className="min-h-full font-sans text-foreground">
        <Header />
        <SmoothScroll>
          <div id="content">{children}</div>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
