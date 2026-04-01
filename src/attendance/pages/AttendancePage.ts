import { BasePage } from './BasePage.js';
import { Page, Locator } from '@playwright/test';
import { AttendanceRecord } from '../types/index.js';

export class AttendancePage extends BasePage {
  private readonly daySelector = '.weeks .day:not(.off-day)';
  private readonly pinkStatusSelector = 'svg.circle-status.pink-status';
  private readonly greenStatusSelector = 'svg.circle-status.green-status';
  private readonly attendanceButtonSelector = '.action-button .add-attendace-bnt';
  private readonly modalSelector = 'aside.aside-menu.open';
  private readonly inTimeSelector = 'input[name="inTime"]';
  private readonly outTimeSelector = 'input[name="outTime"]';
  private readonly remarksSelector = 'section.notes-field textarea';
  private readonly saveButtonSelector = 'button.btn-save.save';
  private readonly closeButtonSelector = '.close-aside';

  constructor(page: Page) {
    super(page);
  }

  async findPinkDays(): Promise<Locator[]> {
    const days = await this.page.locator(this.daySelector).all();
    const result: Locator[] = [];

    for (const day of days) {
      const hasPink = (await day.locator(this.pinkStatusSelector).count()) > 0;
      const hasGreen = (await day.locator(this.greenStatusSelector).count()) > 0;
      const isToday = (await day.locator('.dateNumber.TODAY').count()) > 0;

      if (hasPink && !hasGreen && !isToday) {
        result.push(day);
      }
    }

    return result;
  }

  async openAttendanceForDay(day: Locator): Promise<void> {
    await day.hover();
    await this.page.waitForTimeout(500); // Wait for button to be interactive
    await day.locator(this.attendanceButtonSelector).click();
    await this.page.waitForSelector(this.modalSelector, { state: 'visible' });
  }

  async fillAttendance(record: AttendanceRecord): Promise<void> {
    const modal = this.page.locator(this.modalSelector);
    await modal.locator(this.inTimeSelector).fill(record.inTime);
    await modal.locator(this.outTimeSelector).fill(record.outTime);
    if (record.remarks) {
      await modal.locator(this.remarksSelector).fill(record.remarks);
    }
    const saveBtn = modal.locator(this.saveButtonSelector);
    await saveBtn.waitFor({ state: 'visible' });
    await saveBtn.click();
    await this.page.waitForSelector(this.modalSelector, { state: 'hidden' });
  }

  async waitForGreenStatus(day: Locator): Promise<boolean> {
    try {
      await day.locator(this.greenStatusSelector).waitFor({ state: 'attached', timeout: 15000 });

      return true;
    } catch {
      return false;
    }
  }

  async cancelAttendance(): Promise<void> {
    if (await this.page.locator(this.modalSelector).isVisible()) {
      await this.page.click(this.closeButtonSelector);
    }
  }

  async getDayType(day: Locator): Promise<string> {
    const className = (await day.getAttribute('class')) || '';
    if (className.includes('Day1')) return 'Day1';
    if (className.includes('Day3')) return 'Day3';

    return 'Other';
  }

  async getDayDate(day: Locator): Promise<string> {
    return (await day.locator('.dateNumber').textContent())?.trim() || '?';
  }
}
