"use client";

import { Button } from "@/components/ui/Button";

export function BuyCourseButton() {
  return (
    <form
      className="mt-6"
      onSubmit={(event) => {
        event.preventDefault();
        // TODO: conectar con Stripe/pasarela de pago
      }}
    >
      <Button type="submit" variant="primary" size="lg" className="w-full">
        Comprar curso
      </Button>
    </form>
  );
}
