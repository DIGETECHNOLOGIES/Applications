export const STATUSES = ['new', 'shortlisted', 'selected', 'rejected'] as const;
export type Status = (typeof STATUSES)[number];
export const TOTAL_SPOTS = 10;
