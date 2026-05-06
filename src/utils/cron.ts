export function timeToCron(time: string, timezone: string, dayOfWeek: number): string {
  const [hours, minutes] = time.split(':').map(Number);
  const now = new Date();
  const utc = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
  const local = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
  const offsetMinutes = (local.getTime() - utc.getTime()) / 60000;
  const totalUtcMinutes = (hours * 60 + minutes - offsetMinutes + 1440) % 1440;

  return `${Math.round(totalUtcMinutes % 60)} ${Math.floor(totalUtcMinutes / 60)} * * ${dayOfWeek}`;
}
