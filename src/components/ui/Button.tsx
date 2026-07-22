import { type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "outline";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const baseStyles =
  "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-black text-white hover:bg-black/80",
  secondary: "bg-black/5 text-black hover:bg-black/10",
  outline: "border border-black text-black hover:bg-black hover:text-white",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
}
