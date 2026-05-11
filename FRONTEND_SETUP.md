# Frontend Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation & Running

1. **Navigate to the client directory:**
```bash
cd client
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment:**
```bash
# The .env file is already configured, but you can modify if needed
cat .env
# Should show: VITE_API_URL=http://localhost:3000
```

4. **Start the development server:**
```bash
npm run dev
```

The frontend will be available at **http://localhost:5173**

## 🎯 Running the Full Stack

### Terminal 1 - Backend API
```bash
# From project root
npm start
# or
node dist/src/main.js
```

Backend runs on: **http://localhost:3000**

### Terminal 2 - Frontend
```bash
cd client
npm run dev
```

Frontend runs on: **http://localhost:5173**

## 📱 Using the Application

### 1. Landing Page
- Visit http://localhost:5173
- See the hero section with typewriter animation
- Click "Get Started" to go to login

### 2. Authentication
**Register a new account:**
- Click "Sign up" on login page
- Fill in: Name, Email, Password, Confirm Password
- Click "Create Account"
- You'll be redirected to the dashboard

**Or login with existing account:**
- Enter email and password
- Click "Sign In"

### 3. Dashboard

Once logged in, you can:

**View Overview:**
- See statistics cards (Total Parts, Available, In Maintenance, Workers)
- View charts showing parts distribution and trends
- Check recent activity logs

**Manage Parts:**
- Click "Parts" in sidebar
- View all parts in a data table
- Search and filter parts
- Add new part (click "Add Part" button)
- Click any row to view details
- Edit or delete parts from the modal

**Manage Workers:**
- Click "Workers" in sidebar
- View all workers (currently mock data)
- Search and filter workers
- Add new worker
- Click any row to view details

## 🛠️ Development

### Build for Production
```bash
cd client
npm run build
```

Built files will be in `client/dist/`

### Preview Production Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## 🔧 Configuration

### API URL
Edit `client/.env`:
```env
VITE_API_URL=http://localhost:3000
```

### Theme Customization
Edit `client/src/index.css` to modify the purple/black theme:
```css
:root {
  --primary: 270 91% 65%;    /* Purple */
  --accent: 270 91% 65%;     /* Purple accent */
  /* ... other colors */
}
```

### Adding New Pages

1. Create page component in `src/pages/`:
```typescript
// src/pages/NewPage.tsx
export default function NewPage() {
  return <div>New Page</div>
}
```

2. Add route in `src/App.tsx`:
```typescript
<Route path="/new-page" element={<NewPage />} />
```

## 📊 Features

### Implemented ✅
- [x] Modern purple/black animated UI
- [x] Landing page with typewriter effect
- [x] Login/Register with validation
- [x] Protected routes
- [x] Dashboard with statistics
- [x] Interactive charts (Recharts)
- [x] Parts CRUD with React Query
- [x] Workers management
- [x] Search & filter
- [x] Toast notifications
- [x] Responsive design

### API Integration Status

**Fully Integrated:**
- ✅ Parts API (GET, POST, PATCH, DELETE)
- ✅ Parts Logs API

**Using Mock Data (Ready for API):**
- ⏳ Authentication API
- ⏳ Workers API

## 🐛 Troubleshooting

### Port 5173 already in use
```bash
# Kill process on port 5173
lsof -ti :5173 | xargs kill -9
```

### Dependencies not installing
```bash
# Clean install
cd client
rm -rf node_modules package-lock.json
npm install
```

### Build errors
```bash
# Clear cache and rebuild
rm -rf node_modules/.vite
npm run build
```

### Can't connect to API
1. Ensure backend is running on port 3000
2. Check `client/.env` has correct API URL
3. Verify CORS is enabled on backend

## 📖 Documentation

- [Frontend README](client/README.md) - Comprehensive frontend documentation
- [Project Structure](client/STRUCTURE.md) - Directory structure guide
- [API Client](client/src/api/client.ts) - API integration details

## 🎨 UI Components

All components are in `client/src/components/ui/`:
- Button, Input, Label, Card
- Dialog, Table, Badge, Select
- Dropdown Menu, Toast
- Built with shadcn/ui patterns
- Fully typed with TypeScript
- Styled with Tailwind CSS

## 📦 Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Component library
- **React Router** - Routing
- **React Query** - Data fetching
- **Framer Motion** - Animations
- **Recharts** - Charts
- **Sonner** - Toast notifications
- **Axios** - HTTP client

---

**Need help?** Check the [main README](client/README.md) or the inline documentation in the source files.
