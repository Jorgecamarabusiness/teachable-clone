import { type HTMLAttributes } from "react";

type BadgeVariant = "solid" | "outline";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const baseStyles =
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold";

const variantStyles: Record<BadgeVariant, string> = {
  solid: "bg-black text-white",
  outline: "border border-black text-black",
};

export function Badge({
  variant = "outline",
  className = "",
  ...props
}: BadgeProps) {
  return (
    <span
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
}
