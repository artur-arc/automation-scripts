# Automation Scripts

This repository contains a collection of Playwright and TypeScript-based tools for automating routine daily tasks.

## Current Projects

### Attendance Automation
A script for automatically filling attendance reports on the Priority Connect portal.
- **Intelligent Search**: Identifies days marked with a "pink" status (pending report).
- **Auto-fill**: Enters shift start/end times and appropriate remarks.
- **Security**: Utilizes environment variables to protect credentials.
- **CI/CD**: Configured for automatic execution in GitHub Actions every Thursday at 17:00 Israel time

## Technology Stack
- **Playwright**: Browser automation engine.
- **TypeScript**: Typed language for reliable code.
- **Page Object Model (POM)**: Professional architecture for maintainability.
- **Docker**: Cloud execution optimization using official Playwright images.
- **[♟️ PR CheckMate](https://www.npmjs.com/package/pr-checkmate)**: Automated code quality, formatting, and security standards monitoring.

## Setup and Execution

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a .env file and define your credentials:
   ```env
   ATTENDANCE_LOGIN_USERNAME=your_username
   ATTENDANCE_LOGIN_PASSWORD=your_password
   ```
3. Run the script:
   ```bash
   npm run attendance
   ```

## Project Structure
- `src/core/`: Common tools and the universal script runner.
- `src/attendance/`: Logic, pages, and types for the Attendance project.
- `.github/workflows/`: Configuration for automated cloud execution.