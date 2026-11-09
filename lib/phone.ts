/**
 * Cleans a WhatsApp number and returns it in international format (+2376XXXXXXXX),
 * or null if it does not look like a valid number.
 *
 * Accepted: "6XX XXX XXX", "+237 6XX XXX XXX", "237 6XX XXX XXX", "00237...",
 * and other countries when written with "+" or "00".
 */
export function normalizeWhatsApp(raw: string): string | null {
  const cleaned = raw.replace(/[\s().-]/g, '');
  const hasPlus = cleaned.startsWith('+');
  let digits = hasPlus ? cleaned.slice(1) : cleaned;
  if (!/^\d+$/.test(digits)) return null;

  if (!hasPlus && digits.startsWith('00')) digits = digits.slice(2);
  else if (!hasPlus && digits.length === 9) digits = `237${digits}`; // local Cameroon number

  if (digits.length < 10 || digits.length > 15) return null;
  if (digits.startsWith('237') && digits.length !== 12) return null;
  return `+${digits}`;
}
