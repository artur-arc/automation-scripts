import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { timeToCron } from '../utils';
import config from './attendance.json';

const workflowPath = resolve(process.cwd(), '.github/workflows/attendance.yml');
const cron = timeToCron(config.automation.time, config.automation.timezone, 4);
const comment = `# Every Thursday at ${config.automation.time} ${config.automation.timezone}`;

const workflow = readFileSync(workflowPath, 'utf-8');
const updated = workflow.replace(/- cron: '[^']+' # .*/, `- cron: '${cron}' ${comment}`);

writeFileSync(workflowPath, updated);
console.log(`Schedule updated: ${cron}`);
