🗓️ Events Manager — Full Stack + Web3

A full-stack Events Management module built with Next.js App Router, demonstrating clean architecture, strong type safety, backend CRUD APIs, frontend integration, and a minimal Web3 (Solana) NFT feature.

This project was built as part of a Full-Stack Developer hiring assignment, focusing not only on functionality but also on code quality, ownership, and production readiness.

🚀 Live Demo

🔗 Deployed on Vercel

(Add your Vercel deployment URL here)

📌 Features
✅ Core Features

Create, read, update, and delete events

Event list page with loading & error states

Event detail page with edit & delete options

Fully responsive UI

Clean separation of concerns (services, API routes, UI)

🧠 Engineering Focus

Strong TypeScript usage (type aliases only)

Input validation with Zod

Reusable services & utilities

Proper error handling

Production-safe environment variable usage

🟣 Web3 Bonus Feature

Mint an Event NFT on Solana Devnet

Phantom wallet integration

NFT mint address persisted in database

NFT status & Solana Explorer link shown in UI

🧱 Tech Stack
Frontend

Next.js (App Router)

TypeScript

Tailwind CSS

React Query (TanStack Query)

Framer Motion (optional animations)

Backend

Next.js API Routes

TypeScript

Drizzle ORM

MySQL

Web3

Solana Web3.js

Metaplex JS SDK

Phantom Wallet

Solana Devnet

Database

MySQL (Railway hosted)

Deployment

Vercel (Frontend + Backend)

🗂️ Project Structure
src/
├── app/
│   ├── api/
│   │   └── events/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   ├── events/
│   │   ├── page.tsx
│   │   ├── create/page.tsx
│   │   └── [id]/page.tsx
│   └── layout.tsx
│
├── db/
│   └── schema.ts
│
├── services/
│   └── event.service.ts
│
├── lib/
│   ├── db.ts
│   └── validators.ts
│
└── app/globals.css

🧩 Event Data Model

The Event schema was designed as part of the task:

{
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  imageUrl?: string;
  nftMintAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

🔌 API Endpoints
Method	Endpoint	Description
POST	/api/events	Create event
GET	/api/events	Get all events
GET	/api/events/:id	Get single event
PUT	/api/events/:id	Update event
DELETE	/api/events/:id	Delete event

All endpoints:

Are fully typed

Use Zod for validation

Handle errors gracefully

🟣 Web3 NFT Integration (Bonus)

Each event can be minted as an NFT on Solana Devnet.

How it works:

User connects Phantom Wallet

Clicks Mint Event NFT

NFT is minted using Metaplex

Mint address is stored in DB

UI updates to show:

NFT minted status

Mint address

Link to Solana Explorer

This demonstrates:

Wallet connection

Transaction signing

Blockchain interaction

Persistent on-chain reference

🛠️ Environment Variables
Required
DATABASE_URL=mysql://user:password@host:port/database


Used both locally and in production

Never hardcoded in source code

🧪 Local Development
1️⃣ Install dependencies
npm install

2️⃣ Set up .env
DATABASE_URL=your_local_or_cloud_mysql_url

3️⃣ Run dev server
npm run dev


App runs on:

http://localhost:3000

🌍 Production Deployment
Database

MySQL hosted on Railway

Tables created manually via MySQL client

Fully compatible with any MySQL-compatible provider

Hosting

App deployed on Vercel

Frontend + API routes deployed together

Environment variables managed via Vercel dashboard

⚠️ Notes & Assumptions

Solana NFTs are minted on Devnet (no real value)

NFT metadata uses a lightweight JSON endpoint for simplicity

Tailwind CSS v4 is used

Database credentials are managed securely via environment variables

Web3 implementation is intentionally minimal to prioritize clarity


👤 Author

Jaskaran Singh
Full-Stack Developer
Focused on clean architecture, scalable systems, and modern Web technologies.

✅ Final Note

This project intentionally balances real-world practices with assignment scope, prioritizing maintainability, clarity, and correctness over unnecessary complexity.
