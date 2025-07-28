
# Spending Tracker

A React.js web app for tracking and analyzing personal spending. All data is stored in localStorage. No backend required.


## Features
- Journal page: Add spending records (date, category, amount, note)
- Add new spending categories
- Analytics Dashboard: View spending summary by day, week, month, and category
- Total spending (all time, selected month)
- Line and pie charts for spending trends (using recharts)
- Initial categories loaded from `spending-category.json`

## Getting Started
1. Install dependencies:
   ```powershell
   npm install
   ```
2. Start the development server:
   ```powershell
   npm run dev
   ```
3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure
- `/src` – Main source code
- `/src/pages` – Journal and Dashboard pages
- `/src/components` – Reusable UI components
- `/public/spending-category.json` – Initial spending categories

## Customization
- You can add new categories via the Journal page.
- All data is stored in your browser's localStorage.

