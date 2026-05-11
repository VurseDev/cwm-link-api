# CWM Link Frontend Structure

## Directory Structure

```
client/
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── index.html                    # HTML entry point (updated title)
├── package.json                  # Dependencies (all UI libs added)
├── postcss.config.js             # PostCSS configuration
├── tailwind.config.js            # Tailwind theme configuration
├── tsconfig.app.json             # TypeScript config (with path aliases)
├── vite.config.ts                # Vite config (with path aliases)
│
└── src/
    ├── index.css                 # Global styles (purple/black theme)
    ├── main.tsx                  # Entry point
    ├── App.tsx                   # Main app with routing
    │
    ├── api/
    │   └── client.ts             # API client (axios, parts & auth)
    │
    ├── components/
    │   └── ui/
    │       ├── badge.tsx         # Badge component
    │       ├── button.tsx        # Button component
    │       ├── card.tsx          # Card component
    │       ├── dialog.tsx        # Dialog/modal component
    │       ├── dropdown-menu.tsx # Dropdown menu component
    │       ├── input.tsx         # Input component
    │       ├── label.tsx         # Label component
    │       ├── select.tsx        # Select dropdown
    │       ├── table.tsx         # Table component
    │       ├── toast.tsx         # Toast notification
    │       └── toaster.tsx       # Toast provider
    │
    ├── hooks/
    │   └── use-toast.ts          # Toast hook
    │
    ├── lib/
    │   └── utils.ts              # Utility functions (cn)
    │
    ├── pages/
    │   ├── Dashboard.tsx         # Dashboard layout with sidebar
    │   ├── DashboardOverview.tsx # Overview with stats & charts
    │   ├── Home.tsx              # Landing page (typewriter effect)
    │   ├── Login.tsx             # Login form
    │   ├── PartsList.tsx         # Parts CRUD with React Query
    │   ├── Register.tsx          # Registration form
    │   └── WorkersList.tsx       # Workers list (mock data)
    │
    └── types/
        └── index.ts              # TypeScript types & interfaces
```

## Features Implemented

### Configuration
- ✅ Tailwind CSS with purple/black theme
- ✅ Path aliases (@/ for src)
- ✅ PostCSS with autoprefixer
- ✅ Environment variables setup

### Styling
- ✅ Purple/black gradient theme
- ✅ CSS custom properties for colors
- ✅ Animated gradients
- ✅ Cross pattern backgrounds
- ✅ Glow effects
- ✅ Responsive design

### Components
- ✅ All shadcn/ui components
- ✅ Radix UI primitives
- ✅ Tailwind variants with CVA
- ✅ Fully typed with TypeScript

### Pages
- ✅ Home page with typewriter effect
- ✅ Login/Register with validation
- ✅ Dashboard with sidebar navigation
- ✅ Parts management with CRUD
- ✅ Workers list
- ✅ Dashboard overview with charts

### Integrations
- ✅ React Router DOM (routing)
- ✅ React Query (data fetching)
- ✅ Axios (API client)
- ✅ Sonner (toast notifications)
- ✅ Framer Motion (animations)
- ✅ Recharts (data visualization)
- ✅ Lucide React (icons)

### State Management
- ✅ React Query for server state
- ✅ Local storage for auth tokens
- ✅ Protected routes

## Next Steps

1. Install dependencies:
   ```bash
   cd client
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## API Integration

The frontend expects the API to be running at:
- Development: `http://localhost:3000` (configured in .env)

Update `.env` file to change the API URL.
