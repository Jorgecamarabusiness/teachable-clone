const WHOP_API_BASE = "https://api.whop.com/api/v1";

const INVALID_STATUSES = new Set([
  "canceled",
  "expired",
  "past_due",
  "unresolved",
]);

type WhopMembership = {
  id: string;
  status: string;
  license_key: string | null;
  product: { id: string } | null;
  user: { email: string } | null;
};

export async function getWhopMembershipByLicenseKey(
  licenseKey: string
): Promise<WhopMembership | null> {
  const response = await fetch(
    `${WHOP_API_BASE}/memberships/${encodeURIComponent(licenseKey)}`,
    {
      headers: { Authorization: `Bearer ${process.env.WHOP_API_KEY}` },
      cache: "no-store",
    }
  );

  if (!response.ok) return null;
  return response.json();
}

export function isWhopMembershipValid(membership: WhopMembership): boolean {
  if (INVALID_STATUSES.has(membership.status)) return false;

  const expectedProductId = process.env.WHOP_PRODUCT_ID;
  if (expectedProductId && membership.product?.id !== expectedProductId) {
    return false;
  }

  return true;
}
