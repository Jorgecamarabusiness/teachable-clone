import { type HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className = "", ...props }: CardProps) {
  return (
    <div
      className={`border border-black bg-white text-black ${className}`}
      {...props}
    />
  );
}
