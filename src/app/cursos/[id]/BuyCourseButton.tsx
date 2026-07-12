"use client";

export function BuyCourseButton() {
  return (
    <form
      className="mt-6"
      onSubmit={(event) => {
        event.preventDefault();
        // TODO: conectar con Stripe/pasarela de pago
      }}
    >
      <button
        type="submit"
        className="w-full rounded-full bg-black px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-black/80"
      >
        Comprar curso
      </button>
    </form>
  );
}
