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
} as const;

export const place = {
  office: 'office',
  home: 'home',
} as const;

type Day = keyof typeof week;
type Place = (typeof place)[keyof typeof place];

export const schedule: Record<Day, Place> = {
  sun: place.home,
  mon: place.home,
  tue: place.home,
  wed: place.home,
  thu: place.home,
};
