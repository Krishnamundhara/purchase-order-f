# Frontend - Purchase Order Web App

React + TypeScript (Vite) frontend for the Purchase Order Management System.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
VITE_API_URL=http://localhost:4000/api
```

3. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

## Features

- **Dashboard**: View all purchase orders with search and pagination
- **Create**: Add new purchase orders with validation
- **Edit**: Update existing purchase orders
- **Delete**: Remove purchase orders with confirmation
- **Preview**: View purchase order in a formatted layout
- **Download**: Generate and download PDF of purchase orders
- **Search**: Filter by order number or party name
- **Responsive**: Works on desktop, tablet, and mobile devices

## Color Palette

The app uses a custom Tailwind color palette based on:
- **Primary**: Deep violet (`#6A0DAD`)
- **Secondary**: Cyan (`#00CED1`)
- **Accent**: Light pink (`#FFB6C1`)
- **Neutral**: Dark gray (`#2F4F4F`)

## Architecture

- `/src/pages` - Page components (Dashboard, Create, Edit)
- `/src/components` - Reusable UI components
- `/src/services` - API integration and helpers
- `/src/types` - TypeScript type definitions
- `/src/utils` - Utility functions for formatting and PDF generation
