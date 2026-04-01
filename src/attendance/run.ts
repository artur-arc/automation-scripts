import 'dotenv/config';
import { runAutomation } from '../core/AutomationRunner.js';
import { AttendanceService } from './AttendanceService.js';
import { logger } from '../utils';

void (async (): Promise<void> => {
  const username = process.env.ATTENDANCE_LOGIN_USERNAME;
  const password = process.env.ATTENDANCE_LOGIN_PASSWORD;

  if (!username || !password) {
    logger.error('Missing ATTENDANCE_LOGIN_USERNAME or ATTENDANCE_LOGIN_PASSWORD in .env');
    process.exit(1);
  }

  logger.log('--- Starting Attendance Automation Project ---');

  // Generic runner now handles headless automatically for CI
  await runAutomation(async page => {
    logger.log('--- Navigating to portal...');
    await page.goto('https://p.priority-connect.online/attendance/portal/PP001#/attendance');

    const service = new AttendanceService(page);
    const result = await service.run(username, password);

    logger.log('----------------------------------------------------');
    logger.log(`--- FINISHED OK: ${result.successCount} --- Skipped: ${result.skippedCount}`);
    if (result.errors.length > 0) {
      logger.warn(`--- ERRORS:\n  ${result.errors.join('\n  ')}`);
    }
    logger.log('----------------------------------------------------');
  });
})().catch(e => {
  logger.error(`Critical script error: ${e instanceof Error ? e.message : String(e)}`);
  process.exit(1);
});
