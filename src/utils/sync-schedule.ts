import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { timeToCron } from './cron';

const [configPath, workflowPath] = process.argv.slice(2);

if (!configPath || !workflowPath) {
  console.error('Usage: sync-schedule <config.json> <workflow.yml>');
  process.exit(1);
}

const config = JSON.parse(readFileSync(resolve(process.cwd(), configPath), 'utf-8')) as {
  automation: { time: string; timezone: string };
};

const cron = timeToCron(config.automation.time, config.automation.timezone, 4);
const comment = `# Every Thursday at ${config.automation.time} ${config.automation.timezone}`;

const workflowAbsPath = resolve(process.cwd(), workflowPath);
const workflow = readFileSync(workflowAbsPath, 'utf-8');
const updated = workflow.replace(/- cron: '[^']+' # .*/, `- cron: '${cron}' ${comment}`);

writeFileSync(workflowAbsPath, updated);
console.log(`Schedule updated: ${cron}`);
