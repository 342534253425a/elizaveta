import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { cx } from "@/lib/cx";

type Variant = "solid" | "ghost" | "header";

export function Cta({
  href,
  children,
  variant = "solid",
  type = "button",
  disabled,
  onClick,
  className,
}: {
  href?: string;
  children: React.ReactNode;
  variant?: Variant;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const classNameValue = cx(
    "group inline-flex items-center rounded-full transition duration-300",
    variant === "header"
      ? "h-10 gap-2 bg-plum pl-4 pr-3.5 text-[13.5px] text-white hover:bg-[#4d3e53]"
      : "h-[52px] gap-3 pl-5 pr-1.5 text-[15px]",
    variant === "solid" && "bg-plum text-white hover:bg-[#4d3e53]",
    variant === "ghost" && "bg-white/55 text-foreground ring-1 ring-line hover:bg-white",
    disabled && "pointer-events-none opacity-45",
    className,
  );

  const inner = (
    <>
      <span>{children}</span>
      {variant === "header" ? (
        <ArrowIcon className="size-4 transition duration-300 group-hover:translate-x-0.5" />
      ) : (
        <span
          className={cx(
            "grid size-10 place-items-center rounded-full transition duration-300 group-hover:translate-x-0.5",
            variant === "solid" ? "bg-white text-plum" : "bg-plum text-white",
          )}
        >
          <ArrowIcon className="size-4" />
        </span>
      )}
    </>
  );

  if (href) {
    const external = href.startsWith("http") || href.startsWith("mailto:");
    if (external) {
      return (
        <a href={href} className={classNameValue} onClick={onClick} target="_blank" rel="noreferrer">
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className={classNameValue} onClick={onClick}>
        {inner}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={classNameValue}>
      {inner}
    </button>
  );
}
