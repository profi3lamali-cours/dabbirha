// تنسيق الأرقام والعملة (الدينار الجزائري)

export function formatDZD(amount: number): string {
  const rounded = Math.round(amount);
  const formatted = new Intl.NumberFormat('en-US').format(Math.abs(rounded));
  return `${rounded < 0 ? '-' : ''}${formatted} دج`;
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(n));
}

export function clampPercent(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function daysRemainingInMonth(date = new Date()): number {
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  return lastDay - date.getDate() + 1;
}

export function daysInCurrentMonth(date = new Date()): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function currentMonthKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export const ARABIC_MONTHS = [
  'جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان',
  'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];
