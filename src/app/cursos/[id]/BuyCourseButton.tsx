"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createStripeCheckoutAction, redeemWhopLicenseAction } from "./actions";

export function BuyCourseButton({ courseId }: { courseId: string }) {
  const router = useRouter();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const [showWhopForm, setShowWhopForm] = useState(false);
  const [licenseKey, setLicenseKey] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [whopError, setWhopError] = useState<string | null>(null);

  async function handleStripeCheckout() {
    setIsCheckingOut(true);
    setCheckoutError(null);

    const result = await createStripeCheckoutAction(courseId);

    setIsCheckingOut(false);
    if (result?.error) {
      setCheckoutError(result.error);
    }
  }

  async function handleRedeemWhop(event: React.FormEvent) {
    event.preventDefault();

    setIsRedeeming(true);
    setWhopError(null);

    const result = await redeemWhopLicenseAction(courseId, licenseKey);

    setIsRedeeming(false);

    if (result.error) {
      setWhopError(result.error);
      return;
    }

    router.refresh();
  }

  return (
    <div className="mt-6 flex flex-col gap-3">
      <Button
        type="button"
        variant="primary"
        size="lg"
        className="w-full"
        onClick={handleStripeCheckout}
        disabled={isCheckingOut}
      >
        {isCheckingOut ? "Redirigiendo..." : "Comprar con tarjeta"}
      </Button>
      {checkoutError ? (
        <p className="text-xs font-medium text-muted-foreground">
          Error: {checkoutError}
        </p>
      ) : null}

      {showWhopForm ? (
        <form onSubmit={handleRedeemWhop} className="rounded-md border border-border p-4">
          <label className="block text-xs font-medium text-muted-foreground">
            Código de licencia de Whop
            <input
              type="text"
              value={licenseKey}
              onChange={(event) => setLicenseKey(event.target.value)}
              className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm text-foreground"
              placeholder="Pega aquí tu código"
            />
          </label>

          {whopError ? (
            <p className="mt-2 text-xs font-medium text-muted-foreground">
              {whopError}
            </p>
          ) : null}

          <div className="mt-3 flex gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setShowWhopForm(false)}
              disabled={isRedeeming}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              disabled={!licenseKey.trim() || isRedeeming}
            >
              {isRedeeming ? "Comprobando..." : "Validar código"}
            </Button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setShowWhopForm(true)}
          className="text-center text-sm font-medium text-muted-foreground hover:underline"
        >
          ¿Ya pagaste en Whop?
        </button>
      )}
    </div>
  );
}
