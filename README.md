# Schedule Generator

A web application for creating, managing, and exporting weekly schedules. It is a super helpful tool to all who plan to make their schedules more organized, convenient, and easy to be seen, ensuring an accomplished itinerary.
Built with Next.js, TypeScript, and Python.

## Features

- 📅 Create and manage multiple weekly schedules
- ⚡ Real-time schedule editing
- 🎨 Color-coded activity categories
- 📱 Responsive design for all devices
- 📄 Export schedules to PDF
- 💾 Local storage for schedule persistence
- 📤 Import/Export schedules as JSON

## Tech Stack

- **Frontend:**
  - Next.js
  - TypeScript
  - Tailwind CSS
  - Radix UI Components

- **Backend:**
  - Remove Python (PDF Generation)
  - Remove FPDF Library

## Prerequisites

- Node.js (v14 or higher)
- Python 3.x
- FPDF Python library

## Installation

1. Clone the repository:
```bash
git clone https://github.com/strength-programmer/Schedule-Generator.git 
```
2. Install Node.js dependencies by running `npm install`
3. Install Node.js dependencies by running `pip install -r requirements.txt`

## Running the Application

1. Development mode:
```bash
npm run dev 
```
2. Production build:
```bash
npm run build
npm start 
```
The application will be available at `http://localhost:3000`

## Project Structure
```
Schedule-Generator/
├── app/                   # Next.js app directory
│   ├── api/              # API routes
│   ├── schedule/         # Schedule pages
│   └── page.tsx          # Home page
├── components/           # React components
├── public/              # Static files
├── scripts/             # Utility scripts
└── types.ts            # TypeScript types
```