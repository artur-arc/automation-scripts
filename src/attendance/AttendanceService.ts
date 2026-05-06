import { Page } from '@playwright/test';
import { AutomationResult, week, place } from './types';
import { AttendancePage, LoginPage } from './pages';
import { logger } from '../utils';
import config from './attendance.json';

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
      errors: [],
    };

    try {
      logger.log('--- Logging in...');
      await this.loginPage.login(username, password);
      logger.log('--- Login successful.');

      const pinkDays = await this.attendancePage.findPinkDays();
      logger.log(`--- Found ${pinkDays.length} pink days.`);

      for (const day of pinkDays) {
        const dateStr = await this.attendancePage.getDayDate(day);
        const dayType = await this.attendancePage.getDayType(day);

        const dayName = (Object.entries(week) as [keyof typeof week, string][]).find(
          ([, code]) => code === dayType,
        )?.[0];
        const dayPlace = dayName
          ? config.schedule[dayName as keyof typeof config.schedule]
          : place.home;

        if (dayPlace === place.off) {
          logger.log(`--- SKIP: Day ${dateStr} is off.`);
          continue;
        }

        logger.log(`--- Processing day ${dateStr} (${dayPlace})...`);

        try {
          await this.attendancePage.openAttendanceForDay(day);

          const record = {
            inTime: config.defaults.inTime,
            outTime: config.defaults.outTime,
            remarks: dayPlace === place.office ? 'office' : undefined,
          };

          await this.attendancePage.fillAttendance(record);

          const success = await this.attendancePage.waitForGreenStatus(day);
          if (success) {
            logger.log(`--- OK: Day ${dateStr} saved.`);
            result.successCount++;
          } else {
            throw new Error(`Status didn't turn green for ${dateStr}`);
          }
          await this.page.waitForTimeout(500);
        } catch (e: unknown) {
          const message = e instanceof Error ? e.message : String(e);
          logger.warn(`--- SKIP: Day ${dateStr} failed: ${message}`);
          result.skippedCount++;
          result.errors.push(`${dateStr}: ${message}`);
          await this.attendancePage.cancelAttendance();
          await this.page.waitForTimeout(500);
        }
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      logger.error(`--- CRITICAL ERROR: ${message}`);
      result.errors.push(`Critical: ${message}`);
    }

    return result;
  }
}
