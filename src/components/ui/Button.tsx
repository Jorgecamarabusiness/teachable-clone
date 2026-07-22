import { type ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const baseStyles =
  "inline-flex items-center justify-center rounded-full font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-foreground text-background hover:bg-foreground/90",
  secondary: "bg-muted text-foreground hover:bg-border",
  outline:
    "border border-border text-foreground hover:bg-foreground hover:text-background",
};

export function buttonClassName(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className = ""
) {
  return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`.trim();
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button className={buttonClassName(variant, size, className)} {...props} />
  );
}
