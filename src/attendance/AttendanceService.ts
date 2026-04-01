import { Page } from '@playwright/test';
import { LoginPage } from './pages/LoginPage.js';
import { AttendancePage } from './pages/AttendancePage.js';
import { AutomationResult } from './types/index.js';

export class AttendanceService {
  private readonly loginPage: LoginPage;
  private readonly attendancePage: AttendancePage;

  constructor(private readonly page: Page) {
    this.loginPage = new LoginPage(page);
    this.attendancePage = new AttendancePage(page);
  }

  async run(username: string, password: string): Promise<AutomationResult> {
    const result: AutomationResult = {
      successCount: 0,
      skippedCount: 0,
      errors: []
    };

    try {
      console.log('--- Logging in...');
      await this.loginPage.login(username, password);
      console.log('--- Login successful.');

      const pinkDays = await this.attendancePage.findPinkDays();
      console.log(`--- Found ${pinkDays.length} pink days.`);

      for (const day of pinkDays) {
        const dateStr = await this.attendancePage.getDayDate(day);
        const dayType = await this.attendancePage.getDayType(day);
        console.log(`--- Processing day ${dateStr} (Type: ${dayType})...`);

        try {
          await this.attendancePage.openAttendanceForDay(day);

          const record = {
            inTime: '09:00',
            outTime: '18:00',
            remarks: (dayType === 'Day1' || dayType === 'Day3') ? 'office' : undefined
          };

          await this.attendancePage.fillAttendance(record);

          const success = await this.attendancePage.waitForGreenStatus(day);
          if (success) {
            console.log(`--- OK: Day ${dateStr} saved.`);
            result.successCount++;
          } else {
             throw new Error(`Status didn't turn green for ${dateStr}`);
          }
           await this.page.waitForTimeout(500); // Cooldown

        } catch (e: any) {
          console.warn(`--- SKIP: Day ${dateStr} failed: ${e.message}`);
          result.skippedCount++;
          result.errors.push(`${dateStr}: ${e.message}`);
          await this.attendancePage.cancelAttendance();
          await this.page.waitForTimeout(500);
        }
      }

    } catch (e: any) {
      console.error(`--- CRITICAL ERROR: ${e.message}`);
      result.errors.push(`Critical: ${e.message}`);
    }

    return result;
  }
}
