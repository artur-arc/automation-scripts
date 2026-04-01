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
