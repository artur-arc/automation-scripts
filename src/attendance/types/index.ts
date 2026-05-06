export interface AttendanceRecord {
  inTime: string;
  outTime: string;
  remarks?: string;
}

export interface DayInfo {
  date: string;
  dayType: string; // e.g., "Day1", "Day3", etc.
  status: 'pink' | 'green' | 'other';
  isToday: boolean;
}

export interface AutomationResult {
  successCount: number;
  skippedCount: number;
  errors: string[];
}

export const week = {
  sun: 'Day1',
  mon: 'Day2',
  tue: 'Day3',
  wed: 'Day4',
  thu: 'Day5',
  fri: 'Day6',
  sat: 'Day7',
} as const;

export const place = {
  office: 'office',
  home: 'home',
  off: 'off',
} as const;

export type Day = keyof typeof week;
export type Place = (typeof place)[keyof typeof place];
