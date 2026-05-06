# Attendance automation

Fills unfilled attendance days on the Priority portal using Playwright. Runs every Thursday via GitHub Actions.

## How it works

1. Logs into the portal with credentials from environment variables.
2. Scans the calendar for "pink days" — days where attendance has not been filled.
3. For each pink day, looks up the day of the week in `attendance.json` to get the scheduled place.
4. Fills `inTime`/`outTime` from `defaults`, sets remarks to `"office"` if place is `office`, leaves remarks empty for `home`, skips entirely for `off`.

## Configuration

`attendance.json` is the only file you need to edit.

```json
{
  "automation": { "time": "17:00", "timezone": "Asia/Jerusalem" },
  "baseUrl": "https://...",
  "defaults": { "inTime": "09:00", "outTime": "18:00" },
  "schedule": {
    "sun": "home",
    "mon": "office",
    "tue": "home",
    "wed": "office",
    "thu": "home",
    "fri": "off",
    "sat": "off"
  }
}
```

| Place    | Behavior                                     |
| :------- | :------------------------------------------- |
| `office` | Fills attendance, sets remarks to `"office"` |
| `home`   | Fills attendance, no remarks                 |
| `off` | Day is skipped entirely                      |

After changing `time`, sync the GitHub Actions cron:

```bash
npm run sync-schedule
```

## Environment variables

Set these as GitHub Secrets:

| Variable                    | Description           |
| :-------------------------- | :-------------------- |
| `ATTENDANCE_LOGIN_USERNAME` | Portal login username |
| `ATTENDANCE_LOGIN_PASSWORD` | Portal login password |

## Running manually

Trigger the workflow from the GitHub Actions UI, or run locally:

```bash
npm run attendance
```

## Module structure

```text
attendance/
  attendance.json       ← config (edit this)
  run.ts                ← entry point
  AttendanceService.ts  ← core logic
  pages/
    BasePage.ts
    LoginPage.ts
    AttendancePage.ts
  types/index.ts        ← types and day/place constants

utils/
  cron.ts               ← timeToCron(time, timezone, dayOfWeek)
  sync-schedule.ts      ← updates workflow cron from attendance.json
```
