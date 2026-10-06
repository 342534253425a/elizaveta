import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type IconProps = {
  className?: string;
};

function Stroke({ className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cx("size-6", className)}
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function Logo({ className }: IconProps) {
  return (
    <svg viewBox="0 0 36 36" className={cx("size-9 text-foreground", className)} aria-hidden>
      <path
        d="M18.2 30.5c.2-6.2.6-10.2.8-15.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M18.6 16.2c-.4-5.6-5.2-8.8-9.6-7.6 1.2 4.8 5 7.6 9.6 7.6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M18.4 14.4c2.2-4.8 8-6.6 11.6-4.4-1.8 4.6-6.6 5.6-11.6 4.4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M4 12h15" />
      <path d="M13 6.5 18.5 12 13 17.5" />
    </Stroke>
  );
}

export function ChevronIcon({ className, direction = "left" }: IconProps & { direction?: "left" | "right" }) {
  return (
    <Stroke className={className}>
      {direction === "left" ? <path d="M14.5 5.5 8 12l6.5 6.5" /> : <path d="M9.5 5.5 16 12l-6.5 6.5" />}
    </Stroke>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </Stroke>
  );
}

export function MenuIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M4 8h16" />
      <path d="M4 16h16" />
    </Stroke>
  );
}

export function ChatIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M6.5 16.5 5 19.5l3.4-1.2A8.2 8.2 0 1 0 6.5 16.5Z" />
      <path d="M9 11h.01" />
      <path d="M12 11h.01" />
      <path d="M15 11h.01" />
    </Stroke>
  );
}

export function TargetIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="2.2" />
    </Stroke>
  );
}

export function SproutIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M12 20V10" />
      <path d="M12 13c-3.2-.4-5-3.2-4.4-6.2 3 .4 4.6 3 4.4 6.2Z" />
      <path d="M12 11.5c2.4-2.2 5.8-2.4 7.2-.4-2.2.6-4.6 1.4-7.2.4Z" />
    </Stroke>
  );
}

export function ChartIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M6 18V11" />
      <path d="M12 18V7" />
      <path d="M18 18v-4" />
    </Stroke>
  );
}

export function SparkIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M12 3.5 13.4 9 18.5 12 13.4 15 12 20.5 10.6 15 5.5 12 10.6 9 12 3.5Z" />
    </Stroke>
  );
}

export function PeopleIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <circle cx="9" cy="9" r="2.3" />
      <circle cx="16" cy="10" r="1.9" />
      <path d="M4.8 18.2c.6-2.4 2.4-3.7 4.2-3.7s3.6 1.3 4.2 3.7" />
      <path d="M13.2 14.7c1.3-.3 2.6.1 3.4 1.1.7.8 1 1.7 1.1 2.4" />
    </Stroke>
  );
}

export function CapIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="m3.5 10 8.5-4.5L20.5 10 12 14.5 3.5 10Z" />
      <path d="M7 12.2V16c1.5 1.4 2.8 2 5 2s3.5-.6 5-2v-3.8" />
    </Stroke>
  );
}

export function LotusIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M12 19c0-4 2.2-6.2 2.2-9.2A2.4 2.4 0 0 0 12 7.2 2.4 2.4 0 0 0 9.8 9.8C9.8 12.8 12 15 12 19Z" />
      <path d="M12 19c-3.2-1.2-6-1-7.2-3.2 2.4-.2 4.4.6 7.2 3.2Z" />
      <path d="M12 19c3.2-1.2 6-1 7.2-3.2-2.4-.2-4.4.6-7.2 3.2Z" />
    </Stroke>
  );
}

export function HeartIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M12 18.5s-6.2-3.8-6.2-8A3.4 3.4 0 0 1 12 8.2a3.4 3.4 0 0 1 6.2 2.3c0 4.2-6.2 8-6.2 8Z" />
    </Stroke>
  );
}

export function BookIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M5 6.5h6.2A2.8 2.8 0 0 1 14 9.3V19a2.4 2.4 0 0 0-2.4-2.2H5V6.5Z" />
      <path d="M19 6.5h-6.2A2.8 2.8 0 0 0 10 9.3V19a2.4 2.4 0 0 1 2.4-2.2H19V6.5Z" />
    </Stroke>
  );
}

export function SlidersIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M4 8h16" />
      <path d="M4 16h16" />
      <circle cx="9" cy="8" r="1.7" fill="currentColor" stroke="none" />
      <circle cx="15" cy="16" r="1.7" fill="currentColor" stroke="none" />
    </Stroke>
  );
}

export function ShieldIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M12 4.5 18.5 7v5.2c0 3.6-2.5 6.2-6.5 7.8-4-1.6-6.5-4.2-6.5-7.8V7L12 4.5Z" />
    </Stroke>
  );
}

export function CalendarIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <rect x="4.5" y="5.5" width="15" height="14" rx="2.5" />
      <path d="M8 4.5v3" />
      <path d="M16 4.5v3" />
      <path d="M4.5 10h15" />
    </Stroke>
  );
}

export function PersonIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <circle cx="12" cy="9" r="2.6" />
      <path d="M6.8 18.2c.8-2.8 2.6-4.2 5.2-4.2s4.4 1.4 5.2 4.2" />
    </Stroke>
  );
}

export function TelegramIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="m20 5.5-2.6 13.2c-.2.9-.7 1.1-1.5.7l-4.1-3-2 1.9c-.2.2-.4.4-.8.4l.3-4.2 7.7-7c.3-.3-.1-.4-.5-.2L6.2 12.1 2.2 10.8c-.9-.3-.9-.9.2-1.3L18.8 4.8c.7-.3 1.4.2 1.2.7Z" />
    </Stroke>
  );
}

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M6.8 17.8 5.4 20.6l2.9-1.1A8.2 8.2 0 1 0 6.8 17.8Z" />
      <path d="M9.2 9.6c.2-.4.4-.4.6-.4h.5c.2 0 .4 0 .5.4.2.5.6 1.6.6 1.7 0 .1 0 .3-.1.4l-.3.4c-.1.1-.2.3-.1.5.2.3.7 1.1 1.5 1.5.6.3.8.3 1.1.1l.5-.5c.2-.2.3-.1.5-.1.2.1 1.3.6 1.5.7.2.1.3.2.4.3.1.3 0 1.1-.4 1.5-.5.5-1.4.8-2.3.6-1.3-.2-3-1.1-4.2-2.6-1-1.2-1.6-2.6-1.7-3-.1-.5.3-1.2.7-1.6Z" />
    </Stroke>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <rect x="3.8" y="5.8" width="16.4" height="12.4" rx="2.2" />
      <path d="m5 8 7 5 7-5" />
    </Stroke>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="m5.5 12.5 4.2 4.2 8.8-9" />
    </Stroke>
  );
}

const iconMap = {
  chat: ChatIcon,
  target: TargetIcon,
  sprout: SproutIcon,
  chart: ChartIcon,
  spark: SparkIcon,
  people: PeopleIcon,
  cap: CapIcon,
  lotus: LotusIcon,
  heart: HeartIcon,
  book: BookIcon,
  sliders: SlidersIcon,
  shield: ShieldIcon,
};

export function IconByName({ name, className }: { name: keyof typeof iconMap; className?: string }) {
  const Icon = iconMap[name];
  return <Icon className={className} />;
}
