// 유통기한 D-Day 계산
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

// 오늘 날짜 (YYYY-MM-DD)
export const getToday = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// input용 날짜 포맷 (YYYY-MM-DD)
export const formatDateInput = (dateStr: string): string => {
  if (!dateStr) return getToday();
  try {
    return new Date(dateStr).toISOString().split('T')[0];
  } catch (e) {
    return getToday();
  }
};

// [추가] UI 표시용 날짜 포맷 (예: 2025년 8월 17일)
export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (e) {
    return '-';
  }
};