// utils/dateUtils.ts
export const getDDay = (expiration: string) => {
  if (!expiration) return 0;

  const datePart = expiration.includes('T')
    ? expiration.split('T')[0]
    : expiration;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [y, m, d] = datePart.split('-').map(Number);
  const exp = new Date(y, m - 1, d);

  const diffMs = exp.getTime() - today.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};