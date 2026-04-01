import { Page } from '@playwright/test';

export abstract class BasePage {
  protected constructor(protected readonly page: Page) {}

  async sleep(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  async hover(selector: string): Promise<void> {
    await this.page.hover(selector);
  }

  async waitForSelector(selector: string, timeout = 12000): Promise<void> {
    await this.page.waitForSelector(selector, { timeout });
  }

  async getElementText(selector: string): Promise<string> {
    return (await this.page.textContent(selector))?.trim() || '';
  }
}
