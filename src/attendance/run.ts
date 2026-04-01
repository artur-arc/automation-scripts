import 'dotenv/config';
import { runAutomation } from '../index.js';
import { AttendanceService } from './AttendanceService.js';

(async () => {
  const username = process.env.ATTENDANCE_LOGIN_USERNAME;
  const password = process.env.ATTENDANCE_LOGIN_PASSWORD;

  if (!username || !password) {
    console.error('CRITICAL: ATTENDANCE_LOGIN_USERNAME and ATTENDANCE_LOGIN_PASSWORD must be defined in the .env file.');
    process.exit(1);
  }

  console.log('--- Starting Attendance Automation Project ---');

  await runAutomation(async (page) => {
    console.log('--- Navigating to portal...');
    await page.goto('https://p.priority-connect.online/attendance/portal/PP001#/attendance');

    const service = new AttendanceService(page);
    const result = await service.run(username, password);

    console.log('----------------------------------------------------');
    console.log(`--- FINISHED OK: ${result.successCount} --- Skipped: ${result.skippedCount}`);
    if (result.errors.length > 0) {
      console.warn(`--- ERRORS:\n  ${result.errors.join('\n  ')}`);
    }
    console.log('----------------------------------------------------');
  }, { headless: false }); // User requested headed mode for now
})();
