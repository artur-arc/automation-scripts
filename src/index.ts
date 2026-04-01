import { chromium, Page, BrowserContext, Browser } from '@playwright/test';
import 'dotenv/config';

export interface AutomationOptions {
  headless?: boolean;
}

export type AutomationTask = (page: Page, context: BrowserContext, browser: Browser) => Promise<void>;

/**
 * Generic runner for Playwright automation projects.
 * Handles specialized browser setup, context initialization, and cleanup.
 */
export async function runAutomation(
  task: AutomationTask,
  options: AutomationOptions = {}
): Promise<void> {
  const isCi = !!process.env.CI;
  // Final fix: If in CI, it must be headless.
  const headless = isCi ? true : (options.headless ?? false);

  const browser = await chromium.launch({ headless });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await task(page, context, browser);
  } catch (error: any) {
    console.error(`--- AUTOMATION SCRIPTERROR: ${error.message}`);
    throw error;
  } finally {
    await browser.close();
  }
}
