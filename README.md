# Salesence AI Optimizer

> AI‑powered marketplace analysis tool for optimizing product listings.

---

## Table of Contents

- [About](#about)  
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
- [Project Structure](#project‑structure)  
- [Scripts](#scripts)  
- [Deployment](#deployment)  
- [Contributing](#contributing)  
- [License](#license)  

---

## About

Salesence AI Optimizer is a frontend application built to help marketplace sellers analyze and optimize their product listings. It provides insight into product performance and suggests improvements leveraging AI.  

---

## Features

### Frontend Features
- 🎨 Modern UI built with React + TypeScript
- ⚡ Fast styling using Tailwind CSS
- 🎭 Component library via shadcn‑ui
- 📱 Fully responsive design
- 🌐 Multi-language support (i18n)
- 🎯 Real-time product analysis

### Backend Features
- 🤖 AI-powered product scraping (Amazon, Trendyol, Hepsiburada)
- 🔍 Smart product recommendations
- 💾 Database persistence with Supabase
- 🚀 RESTful API with Express
- 🛡️ Error handling and rate limiting
- 📊 Competitive analysis

### Integration Features
- ✅ Real-time backend connection
- ✅ Smart fallback to demo mode if backend unavailable
- ✅ Toast notifications for user feedback
- ✅ Seamless data transformation
- ✅ CORS configured for local development  

---

## Tech Stack

| Component    | Technology                     |
|---------------|---------------------------------|
| Frontend       | React, TypeScript              |
| Style / UI     | Tailwind CSS, shadcn‑ui         |
| Bundler / Dev  | Vite                            |
| Configurations | ESLint, PostCSS, Tailwind config |

---

## Getting Started

This is a **full-stack application** with both frontend and backend components.

### Prerequisites

- Node.js (v18+ recommended)
- npm or pnpm package manager
- Supabase account (database already configured)

### Quick Start

#### ⚡ One Command (Recommended) - NEW! ⭐

Open ONE terminal and run:

```bash
npm start
```

This will automatically start **both frontend and backend servers** together!
- ✅ Frontend: http://localhost:5173
- ✅ Backend: http://localhost:3000

#### Alternative: Manual Start (Two Terminals)

**Terminal 1 - Backend:**
```bash
cd product-scraper
npm install
npm run dev
# Backend runs on http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

> **Tip**: Use `npm start` for the easiest experience!

### First Time Setup

**1. Install Frontend Dependencies:**
```bash
npm install
```

**2. Install Backend Dependencies (PowerShell):**
```powershell
cd product-scraper
$env:CI="true"
pnpm install
pnpm --filter @scraper/db exec prisma generate
cd ..
```

**Or simply run the provided script:**
```powershell
cd product-scraper
.\install-deps.ps1
cd ..
```

**3. Start Both Servers:**
```bash
npm start
```

**4. Open Browser:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3000/health

### Environment Configuration

1. **Frontend (.env)** - Already configured with:
   - `VITE_API_BASE_URL=http://localhost:3000` (Backend API)
   - Translation settings (optional)

2. **Backend (.env)** - Located in `product-scraper/` with:
   - `PORT=3000` (Backend port)
   - `DATABASE_URL` (Supabase connection)
   - Scraping configuration

Both `.env` files are already set up and ready to use!

---

## Project Structure

```
salesenceeee/                      # Root - Frontend
├── public/                        # Public assets
├── src/                           # Frontend source code
│   ├── components/                # React components
│   ├── pages/                     # Page components
│   ├── services/                  # API service layer
│   │   └── api.service.ts         # Backend communication
│   ├── types/                     # TypeScript types
│   │   └── api.types.ts           # API response types
│   ├── utils/                     # Utility functions
│   │   ├── apiTransformer.ts      # Response transformation
│   │   └── mockDataGenerator.ts   # Demo data fallback
│   └── App.tsx                    # Main app component
├── product-scraper/               # Backend
│   ├── apps/
│   │   └── api/                   # Express API server
│   │       └── src/
│   │           ├── server.ts      # Main server file
│   │           └── routes/
│   │               ├── health.ts  # Health check endpoint
│   │               └── analyze.ts # Product analysis endpoint
│   ├── packages/
│   │   ├── db/                    # Prisma database layer
│   │   │   └── prisma/
│   │   │       └── schema.prisma  # Database schema
│   │   └── scraper-core/          # Scraping logic
│   └── .env                       # Backend configuration
├── .env                           # Frontend configuration
└── package.json                   # Frontend dependencies
```

---

## Scripts

Available npm scripts in `package.json`:

| Script | Purpose |
|--------|---------|
| `npm start` | **Start both frontend + backend** (recommended) |
| `npm run dev:all` | Same as npm start |
| `npm run dev` | Start frontend only |
| `npm run dev:frontend` | Start frontend only |
| `npm run dev:backend` | Start backend only |
| `npm run build` | Build frontend for production |
| `npm run lint` | Run ESLint checks |
| `npm run preview` | Preview production build |

---

## Troubleshooting

### "Cannot find module 'concurrently'"

If you see this error when running `npm start`:

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd product-scraper
npm install
cd ..

# Try again
npm start
```

### Port Already in Use

If ports 3000 or 5173 are already in use:

**Windows:**
```bash
# Find and kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Find and kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Backend Not Starting

**In PowerShell:**
```powershell
cd product-scraper
$env:CI="true"
pnpm install
pnpm --filter @scraper/db exec prisma generate
cd ..
npm start
```

**Or use the script:**
```powershell
cd product-scraper
.\install-deps.ps1
cd ..
npm start
```

### Frontend Can't Connect to Backend

1. Verify backend is running at http://localhost:3000/health
2. Check `.env` file has: `VITE_API_BASE_URL=http://localhost:3000`
3. Check browser console for CORS errors

---

## Deployment

To deploy the project:

1. Build for production:

   ```bash
   npm run build
   # or
   yarn build
   ```

2. The build output (often in `dist/` or `build/` folder) can then be deployed to a static host such as:

   - Vercel  
   - Netlify  
   - GitHub Pages  
   - any other static file hosting service

3. (Optional) If using a custom domain, configure the DNS / hosting platform accordingly.

---

## Contributing

Contributions are welcome!  

If you’d like to help, you can:

- Fork the repo  
- Create a new branch (`git checkout -b feature/your‑feature`)  
- Make your changes  
- Test them locally  
- Submit a pull request  

Please try to follow existing style and conventions. If there is a style guide (or formatter), use that. Workflow for code reviews TBD.

---

## License

Add license info here. For example:

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## Contact

Project maintained by [Bhagyaholkade](https://github.com/Bhagyaholkade) and [Likhith Pullela](https://github.com/Likhith1201).  
If you have questions, suggestions, or issues, feel free to reach out or open an issue.
