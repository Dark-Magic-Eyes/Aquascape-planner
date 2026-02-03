# 🎓 Codebase Walkthrough - Aquascape Planner

**Mục tiêu:** Hiểu rõ toàn bộ codebase từ config đến features, từ cơ bản đến nâng cao.

**Thời gian dự kiến:** 1-2 giờ đọc kỹ

**Cách dùng guide này:**

1. Đọc từng section theo thứ tự
2. Mở file được mention để xem code thực tế
3. Chạy commands để test hiểu biết
4. Không vội, hiểu sâu từng phần

---

# 📚 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Config Files Explained](#2-config-files-explained)
3. [Source Code Structure](#3-source-code-structure)
4. [Entry Point & Routing](#4-entry-point--routing)
5. [Feature Deep Dive - Tank](#5-feature-deep-dive---tank)
6. [Shared Code](#6-shared-code)
7. [How Everything Works Together](#7-how-everything-works-together)
8. [Development Workflow](#8-development-workflow)
9. [Common Tasks](#9-common-tasks)
10. [Quiz & Exercises](#10-quiz--exercises)

---

# 1. Project Overview

## 1.1 What is this project?

**Aquascape Planner** - Web app để track thủy sinh:

- Track tanks (bể cá)
- Log maintenance (thay nước, tỉa cây)
- Get insights (cảnh báo tảo, nhắc bảo trì)

## 1.2 Tech Stack

```
React 19          → UI library
TypeScript        → Type safety
Vite             → Build tool (fast!)
TanStack Router  → File-based routing
Zustand          → State management
Tailwind CSS     → Styling
shadcn/ui        → UI components
```

## 1.3 Architecture Philosophy

**Feature-based architecture:**

- Mỗi feature tự quản lý: UI, logic, state
- Features độc lập, không cross-import
- Shared code reusable
- Routes chỉ orchestrate (ghép features lại)

**Tại sao?**

- ✅ Scale tốt (thêm features dễ)
- ✅ Test dễ (features isolated)
- ✅ Team work tốt (không conflict)
- ✅ Maintainability cao

---

# 2. Config Files Explained

## 2.1 package.json - Project Manifest

**Location:** `/package.json`

**Đọc file này:**

```json
{
  "name": "aquascape-planner",
  "type": "module", // ← ESM (import/export), không phải CommonJS (require)

  "scripts": {
    "dev": "vite", // ← Start dev server
    "build": "tsc -b && vite build", // ← Type check + build
    "lint": "eslint .", // ← Check code quality
    "format": "prettier --write ...", // ← Auto format code
    "prepare": "husky" // ← Setup git hooks (auto-run)
  }
}
```

**Dependencies quan trọng:**

```json
{
  // UI & Routing
  "@tanstack/react-router": "Router with file-based routes",
  "zustand": "State management (simpler than Redux)",

  // UI Components
  "@radix-ui/*": "Headless components (nền tảng của shadcn)",
  "tailwindcss": "Utility-first CSS",

  // Dev Tools
  "husky": "Git hooks (chạy checks trước commit)",
  "prettier": "Code formatter",
  "eslint": "Code linter"
}
```

**Test hiểu:**

```bash
# Xem tất cả scripts
yarn run

# Chạy dev server
yarn dev
# → Mở http://localhost:5173
```

---

## 2.2 tsconfig.\*.json - TypeScript Config

**3 files:**

1. `tsconfig.json` - Master config
2. `tsconfig.app.json` - Config cho src/ code
3. `tsconfig.node.json` - Config cho vite.config.ts

### tsconfig.json (Master)

**Location:** `/tsconfig.json`

```json
{
  "files": [], // ← Không compile gì ở đây
  "references": [
    { "path": "./tsconfig.app.json" }, // ← Compile src/
    { "path": "./tsconfig.node.json" } // ← Compile vite.config.ts
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"] // ← @/components = src/components
    }
  }
}
```

**Tại sao tách ra?**

- `src/` code chạy trong browser (ES2022, DOM APIs)
- `vite.config.ts` chạy trong Node.js (ES2023, Node APIs)
- Environments khác nhau → configs khác nhau

### tsconfig.app.json (App Code)

**Location:** `/tsconfig.app.json`

```json
{
  "compilerOptions": {
    "target": "ES2022", // ← Compile xuống ES2022
    "jsx": "react-jsx", // ← Support JSX
    "strict": true, // ← Strict type checking
    "noUnusedLocals": true, // ← Báo lỗi nếu có biến không dùng

    // Path mapping
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"] // ← Import alias
    }
  },
  "include": ["src"] // ← Chỉ compile src/
}
```

**Test hiểu:**

```typescript
// Without path alias
import { Button } from '../../../shared/ui/button'

// With path alias (@/)
import { Button } from '@/shared/ui/button' // ← Cleaner!
```

---

## 2.3 vite.config.ts - Build Tool Config

**Location:** `/vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    TanStackRouterVite(), // ← Auto-generate routes từ src/routes/
    react(), // ← Transform JSX
    tailwindcss(), // ← Process Tailwind CSS
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // ← @ = src/
    },
  },
})
```

**Plugins giải thích:**

1. **TanStackRouterVite()**
   - Scan `src/routes/` folder
   - Auto-generate `routeTree.gen.ts`
   - Type-safe routing

2. **react()**
   - Transform JSX → JavaScript
   - Fast refresh (HMR)

3. **tailwindcss()**
   - Process Tailwind classes
   - Generate CSS

**Test hiểu:**

```bash
# Build project
yarn build

# → Vite runs plugins:
# 1. TanStack scans routes/
# 2. React transforms JSX
# 3. Tailwind generates CSS
# → Output: dist/
```

---

## 2.4 eslint.config.js - Code Quality Rules

**Location:** `/eslint.config.js`

```javascript
export default defineConfig([
  // Global ignores
  globalIgnores(['dist', '.tanstack', '*.gen.ts']),

  // Base rules for all files
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended, // ← JS best practices
      tseslint.configs.recommended, // ← TS best practices
      reactHooks.configs.flat.recommended, // ← React Hooks rules
      prettierConfig, // ← Disable conflicts với Prettier
    ],
  },

  // Architecture rules
  {
    files: ['src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*/!(index).{ts,tsx}'],
              message: '🚫 Features cannot cross-import',
            },
          ],
        },
      ],
    },
  },
])
```

**4 Architecture Rules:**

1. Features không cross-import
2. Shared không depend features
3. Routes chỉ orchestration
4. Shared/UI pure components

**Test hiểu:**

```bash
# Chạy ESLint
yarn lint

# Tạo file vi phạm
echo "import { useTankStore } from '../tank/store'" > src/features/log/test.tsx

# Chạy lint lại
yarn lint
# → Error: Features cannot cross-import ✅
```

---

## 2.5 .prettierrc - Code Formatting

**Location:** `/.prettierrc`

```json
{
  "semi": false, // ← Không dùng semicolon
  "singleQuote": true, // ← Single quotes
  "tabWidth": 2, // ← 2 spaces indent
  "printWidth": 100, // ← Max 100 chars/line
  "plugins": ["prettier-plugin-tailwindcss"] // ← Sort Tailwind classes
}
```

**Example:**

```typescript
// Before Prettier
function foo() {
  const x = 5
  return x
}

// After Prettier
function foo() {
  const x = 5
  return x
}
```

**Test hiểu:**

```bash
# Format all code
yarn format

# Check một file cụ thể
npx prettier --check src/main.tsx
```

---

## 2.6 components.json - shadcn Config

**Location:** `/components.json`

```json
{
  "style": "new-york", // ← shadcn style variant
  "tsx": true, // ← Use TypeScript
  "tailwind": {
    "css": "src/index.css", // ← Global CSS file
    "baseColor": "neutral" // ← Color scheme
  },
  "aliases": {
    "components": "@/shared", // ← shadcn CLI tạo components ở đây
    "ui": "@/shared/ui",
    "utils": "@/shared/lib/utils"
  }
}
```

**Cách dùng:**

```bash
# Add component
npx shadcn add dropdown-menu

# → File được tạo ở:
# src/shared/ui/dropdown-menu.tsx
```

---

## 2.7 .husky/ - Git Hooks

**Location:** `/.husky/pre-commit`

```bash
yarn lint-staged
```

**Workflow:**

```
git commit
  ↓
Husky intercepts
  ↓
Runs lint-staged
  ↓
ESLint + Prettier on staged files
  ↓
Pass? → Commit ✅
Fail? → Block ❌
```

**Test hiểu:**

```bash
# Tạo file lỗi
echo "const x = 1" > src/test.ts  # unused variable

# Thử commit
git add src/test.ts
git commit -m "test"

# → ESLint error: 'x' is assigned but never used
# → Commit blocked ✅
```

---

# 3. Source Code Structure

## 3.1 Full Directory Tree

```
src/
├── 📁 assets/              # Static files (images, icons)
│   └── react.svg
│
├── 📁 features/            # Business logic (isolated)
│   ├── tank/              ✅ Implemented
│   │   ├── components/
│   │   │   ├── TankForm.tsx
│   │   │   └── TankList.tsx
│   │   ├── hooks/
│   │   ├── index.ts       # Public API
│   │   ├── store.ts       # Zustand store
│   │   └── types.ts       # TypeScript types
│   │
│   ├── log/               ⏳ TODO
│   │   ├── components/
│   │   └── hooks/
│   │
│   └── insight/           ⏳ TODO
│       ├── components/
│       └── rules/
│
├── 📁 routes/              # File-based routing
│   ├── __root.tsx         # Layout wrapper
│   ├── index.tsx          # Homepage (/)
│   └── tanks.tsx          # /tanks page
│
├── 📁 shared/              # Reusable code
│   ├── ui/                # UI primitives (Button, Card...)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── lib/               # Utilities
│   │   └── utils.ts
│   └── hooks/             # Custom hooks (empty)
│
├── 📄 index.css           # Global CSS + Tailwind
├── 📄 main.tsx            # Entry point
└── 📄 routeTree.gen.ts    # Auto-generated (don't edit!)
```

## 3.2 Folder Roles

| Folder      | Purpose        | Can Import From         | Cannot Import From |
| ----------- | -------------- | ----------------------- | ------------------ |
| `features/` | Business logic | `shared/`, same feature | Other features     |
| `shared/`   | Reusable code  | Other `shared/`         | `features/`        |
| `routes/`   | Orchestration  | `features/`, `shared/`  | -                  |
| `assets/`   | Static files   | -                       | -                  |

**Rule of thumb:**

```
routes/ → features/ → shared/
(Top)     (Middle)    (Bottom)

Dependencies flow: Top → Bottom only
```

---

# 4. Entry Point & Routing

## 4.1 index.html - HTML Entry

**Location:** `/index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>aquascape-planner</title>
  </head>
  <body>
    <div id="root"></div>
    ← React mount point
    <script type="module" src="/src/main.tsx"></script>
    ← Entry script
  </body>
</html>
```

**Flow:**

```
Browser loads index.html
  ↓
Vite injects main.tsx (dev mode)
  ↓
React app mounts to #root
```

---

## 4.2 main.tsx - JavaScript Entry

**Location:** `/src/main.tsx`

**Đọc code từng dòng:**

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import './index.css'  // ← Global styles + Tailwind

// Import the generated route tree
import { routeTree } from './routeTree.gen'
// ↑ Auto-generated từ src/routes/ bởi TanStack Router plugin

// Create router instance
const router = createRouter({ routeTree })

// Type safety: Register router globally
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router  // ← TypeScript biết routes nào tồn tại
  }
}

// Mount React app
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
```

**Step-by-step:**

1. Import router utilities
2. Import auto-generated `routeTree`
3. Create router instance
4. Register types for autocomplete
5. Mount `<RouterProvider>` to DOM

**Test hiểu:**

```bash
# Start dev server
yarn dev

# Open browser console, type:
window.__router__
# → You'll see router instance with all routes
```

---

## 4.3 routeTree.gen.ts - Auto-generated Routes

**Location:** `/src/routeTree.gen.ts`

**⚠️ IMPORTANT: Don't edit this file!**

```typescript
// Auto-generated by TanStack Router plugin

import { Route as rootRoute } from './routes/__root'
import { Route as TanksRoute } from './routes/tanks'
import { Route as IndexRoute } from './routes/index'

// Tree structure
const routeTree = rootRoute.addChildren([TanksRoute, IndexRoute])

export { routeTree }
```

**Cách hoạt động:**

```
1. Bạn tạo: src/routes/about.tsx
2. Vite dev server chạy
3. TanStack Router plugin scan src/routes/
4. Auto-generate routeTree.gen.ts
5. Router biết route /about tồn tại
```

**Test hiểu:**

```bash
# Tạo route mới
echo "export const Route = createFileRoute('/test')({ component: () => <div>Test</div> })" > src/routes/test.tsx

# Dev server tự động regenerate routeTree.gen.ts
# Visit http://localhost:5173/test
```

---

## 4.4 routes/\_\_root.tsx - Layout Wrapper

**Location:** `/src/routes/__root.tsx`

**Purpose:** Layout cho tất cả pages

```typescript
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-background">
      {/* Navigation bar */}
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold">
              Aquascape Planner
            </Link>
            <div className="flex gap-4">
              <Link to="/tanks">Tanks</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Page content renders here */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />  {/* ← Child routes render here */}
      </main>
    </div>
  ),
})
```

**Key concepts:**

- `<Outlet />` = placeholder cho child routes
- Layout này wrap tất cả pages
- Navigation bar hiện ở mọi page

**Visual:**

```
┌─────────────────────────────┐
│  Nav Bar (from __root.tsx)  │
├─────────────────────────────┤
│                             │
│  <Outlet /> renders:        │
│  - index.tsx (/)            │
│  - tanks.tsx (/tanks)       │
│  - etc...                   │
│                             │
└─────────────────────────────┘
```

---

## 4.5 routes/index.tsx - Homepage

**Location:** `/src/routes/index.tsx`

```typescript
import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="space-y-8">
      <h2>Welcome to Aquascape Planner</h2>

      {/* Feature cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Tanks</CardTitle></CardHeader>
          <CardContent>
            <Link to="/tanks">
              <Button>View Tanks</Button>
            </Link>
          </CardContent>
        </Card>
        {/* More cards... */}
      </div>
    </div>
  )
}
```

**Key concepts:**

- `createFileRoute('/')` = homepage route
- `component: Index` = React component to render
- Imports từ `@/shared/ui` (UI primitives)
- `<Link to="/tanks">` = Client-side navigation

**URL mapping:**

```
File: src/routes/index.tsx  →  URL: /
File: src/routes/tanks.tsx  →  URL: /tanks
File: src/routes/about.tsx  →  URL: /about
```

---

## 4.6 routes/tanks.tsx - Tanks Page

**Location:** `/src/routes/tanks.tsx`

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { TankForm, TankList } from '../features/tank'
//      ↑ Import từ feature public API (index.ts)

export const Route = createFileRoute('/tanks')({
  component: TanksPage,
})

function TanksPage() {
  return (
    <div className="space-y-8">
      <h2>Your Tanks</h2>

      {/* Orchestrate feature components */}
      <TankForm />   {/* ← From features/tank */}
      <TankList />   {/* ← From features/tank */}
    </div>
  )
}
```

**Key points:**

- ✅ Imports từ `features/tank` (public API)
- ✅ Chỉ orchestrate components
- ❌ Không có business logic
- ❌ Không tạo stores

**This is correct orchestration:**

```typescript
// ✅ GOOD
<TankForm />
<TankList />

// ❌ BAD - Business logic in route
const [tanks, setTanks] = useState([])
const addTank = (tank) => { /* logic */ }
```

---

# 5. Feature Deep Dive - Tank

## 5.1 Feature Structure

```
features/tank/
├── components/
│   ├── TankForm.tsx    # Form để tạo tank
│   └── TankList.tsx    # Grid hiển thị tanks
├── hooks/              # Custom hooks (empty hiện tại)
├── index.ts            # Public API - ONLY export này
├── store.ts            # Zustand store
└── types.ts            # TypeScript types
```

**Principle:** Everything tank-related lives in `features/tank/`

---

## 5.2 types.ts - Data Models

**Location:** `/src/features/tank/types.ts`

```typescript
export type Tank = {
  id: string // UUID
  name: string // "Main Display Tank"
  size: number // liters (60, 120, etc.)
  filterType: string // "Canister", "HOB", "Sponge"
  lightingHours: number // hours per day (0-24)
  hasCO2: boolean // true/false
  createdAt: Date // Timestamp
}

export type CreateTankInput = Omit<Tank, 'id' | 'createdAt'>
//                            ↑ Tất cả fields trừ id & createdAt
```

**Tại sao tách types?**

- ✅ Reusable (dùng ở store, components, etc.)
- ✅ Type safety
- ✅ Single source of truth

**Test hiểu:**

```typescript
// CreateTankInput has:
{
  name: string
  size: number
  filterType: string
  lightingHours: number
  hasCO2: boolean
}
// Missing: id, createdAt (auto-generated)
```

---

## 5.3 store.ts - State Management

**Location:** `/src/features/tank/store.ts`

**Zustand là gì?**

- State management library (như Redux nhưng đơn giản hơn)
- No boilerplate
- No providers
- Hook-based

**Code explained:**

```typescript
import { create } from 'zustand'
import type { Tank, CreateTankInput } from './types'

type TankStore = {
  // State
  tanks: Tank[]

  // Actions
  addTank: (input: CreateTankInput) => void
  removeTank: (id: string) => void
  updateTank: (id: string, updates: Partial<CreateTankInput>) => void
  getTankById: (id: string) => Tank | undefined
}

export const useTankStore = create<TankStore>((set, get) => ({
  // Initial state
  tanks: [],

  // Action: Add tank
  addTank: (input) => {
    const newTank: Tank = {
      ...input,
      id: crypto.randomUUID(), // Generate unique ID
      createdAt: new Date(), // Current timestamp
    }
    set((state) => ({
      tanks: [...state.tanks, newTank], // Immutable update
    }))
  },

  // Action: Remove tank
  removeTank: (id) => {
    set((state) => ({
      tanks: state.tanks.filter((t) => t.id !== id),
    }))
  },

  // Action: Update tank
  updateTank: (id, updates) => {
    set((state) => ({
      tanks: state.tanks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }))
  },

  // Selector: Get tank by ID
  getTankById: (id) => {
    return get().tanks.find((t) => t.id === id)
  },
}))
```

**Key concepts:**

1. **`create<TankStore>`** - Create store với type
2. **`set()`** - Update state (immutable)
3. **`get()`** - Read current state
4. **Immutability** - Always create new arrays/objects

**Usage example:**

```typescript
// In component
import { useTankStore } from '@/features/tank/store'

function MyComponent() {
  // Subscribe to tanks
  const tanks = useTankStore((state) => state.tanks)

  // Get actions
  const addTank = useTankStore((state) => state.addTank)

  // Use them
  const handleAdd = () => {
    addTank({
      name: 'New Tank',
      size: 60,
      filterType: 'Canister',
      lightingHours: 8,
      hasCO2: true
    })
  }

  return <div>{tanks.length} tanks</div>
}
```

**Test hiểu:**

```bash
# Open browser console
# In component using useTankStore:

useTankStore.getState()
# → { tanks: [], addTank: f, removeTank: f, ... }

useTankStore.getState().addTank({ name: 'Test', ... })
useTankStore.getState().tanks
# → [{ id: '...', name: 'Test', ... }]
```

---

## 5.4 components/TankForm.tsx - Form Component

**Location:** `/src/features/tank/components/TankForm.tsx`

**Purpose:** Form để tạo tank mới

**Code explained (simplified):**

```typescript
import { useState } from 'react'
import { useTankStore } from '../store'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Card } from '@/shared/ui/card'

export function TankForm() {
  // Get action từ store
  const addTank = useTankStore((state) => state.addTank)

  // Local form state
  const [formData, setFormData] = useState({
    name: '',
    size: 0,
    filterType: '',
    lightingHours: 8,
    hasCO2: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Call store action
    addTank(formData)

    // Reset form
    setFormData({
      name: '',
      size: 0,
      filterType: '',
      lightingHours: 8,
      hasCO2: false,
    })
  }

  return (
    <Card>
      <CardHeader><CardTitle>Add New Tank</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Tank name"
          />

          <Input
            type="number"
            value={formData.size}
            onChange={(e) => setFormData({ ...formData, size: Number(e.target.value) })}
          />

          {/* More inputs... */}

          <Button type="submit">Add Tank</Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

**Key concepts:**

1. **Local state** (`useState`) - Form data
2. **Store action** (`addTank`) - Submit to global state
3. **Controlled inputs** - `value` + `onChange`
4. **Form reset** - After submit

**Data flow:**

```
User types → formData updates (local state)
  ↓
User submits → addTank(formData) (store action)
  ↓
Store updates → tanks array grows
  ↓
TankList re-renders (subscribed to tanks)
```

---

## 5.5 components/TankList.tsx - List Component

**Location:** `/src/features/tank/components/TankList.tsx`

**Purpose:** Display tanks in grid

```typescript
import { useTankStore } from '../store'
import { Card } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'

export function TankList() {
  // Subscribe to tanks (re-renders when tanks change)
  const tanks = useTankStore((state) => state.tanks)
  const removeTank = useTankStore((state) => state.removeTank)

  if (tanks.length === 0) {
    return <div>No tanks yet. Create your first tank above!</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tanks.map((tank) => (
        <Card key={tank.id}>
          <CardHeader><CardTitle>{tank.name}</CardTitle></CardHeader>
          <CardContent>
            <div>Size: {tank.size}L</div>
            <div>Filter: {tank.filterType}</div>
            <div>Lighting: {tank.lightingHours}h/day</div>
            <div>CO₂: {tank.hasCO2 ? 'Yes' : 'No'}</div>

            <Button
              variant="destructive"
              onClick={() => removeTank(tank.id)}
            >
              Delete
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

**Key concepts:**

1. **Selector** - `(state) => state.tanks` chỉ subscribe tanks
2. **Re-render** - Component re-renders khi tanks thay đổi
3. **Grid layout** - Responsive (2 cols → 3 cols)
4. **Delete action** - Call `removeTank(id)`

**Performance note:**

```typescript
// ✅ GOOD - Only re-renders when tanks change
const tanks = useTankStore((state) => state.tanks)

// ❌ BAD - Re-renders on ANY store change
const store = useTankStore()
const tanks = store.tanks
```

---

## 5.6 index.ts - Public API

**Location:** `/src/features/tank/index.ts`

**Purpose:** Feature's public interface

```typescript
export { TankForm } from './components/TankForm'
export { TankList } from './components/TankList'
export { useTankStore } from './store'
export type { Tank, CreateTankInput } from './types'
```

**Why?**

- ✅ Encapsulation - Hide internals
- ✅ Clean imports - One source
- ✅ Easy to refactor - Internal structure can change

**Usage:**

```typescript
// ✅ GOOD - Import from public API
import { TankForm, TankList, useTankStore } from '@/features/tank'

// ❌ BAD - Import from internals
import { TankForm } from '@/features/tank/components/TankForm'
import { useTankStore } from '@/features/tank/store'
```

**ESLint enforces this:**

```typescript
// In routes/
import { TankForm } from '@/features/tank/components/TankForm'
// → Error: Import via public API (index.ts) only!
```

---

# 6. Shared Code

## 6.1 shared/ui/ - UI Primitives

**Location:** `/src/shared/ui/`

**Components:**

- `button.tsx` - Button variants
- `card.tsx` - Card container
- `dialog.tsx` - Modal dialogs
- `input.tsx` - Text input
- etc.

**These are shadcn/ui components:**

- Headless (no business logic)
- Styled with Tailwind
- Accessible (ARIA)
- Customizable

**Example: button.tsx**

```typescript
import { cn } from '@/shared/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8"
      }
    }
  }
)

export function Button({ variant, size, className, ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
```

**Usage:**

```typescript
<Button>Default</Button>
<Button variant="destructive">Delete</Button>
<Button size="sm">Small</Button>
```

**Key principle:**

- ✅ Pure/presentational
- ✅ No state management (no zustand, no API calls)
- ✅ Reusable across features

---

## 6.2 shared/lib/utils.ts - Utilities

**Location:** `/src/shared/lib/utils.ts`

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**What does `cn()` do?**

Combines class names smartly:

```typescript
// Without cn()
<div className={"p-4 " + (isActive ? "bg-blue-500" : "bg-gray-500")} />
// → "p-4 bg-blue-500" or "p-4 bg-gray-500"

// With cn()
<div className={cn("p-4", isActive ? "bg-blue-500" : "bg-gray-500")} />
// → Same result, cleaner syntax

// Handles conflicts (twMerge)
cn("p-4 p-8")  // → "p-8" (last wins)
```

**Used everywhere in UI components:**

```typescript
<button className={cn(
  "base-styles",
  variant === "primary" && "primary-styles",
  className  // Allow override
)} />
```

---

# 7. How Everything Works Together

## 7.1 Full Data Flow - Adding a Tank

**Step-by-step:**

```
1. User visits /tanks
   ↓
2. Router renders TanksPage (routes/tanks.tsx)
   ↓
3. TanksPage renders <TankForm /> + <TankList />
   ↓
4. User fills form, clicks "Add Tank"
   ↓
5. TankForm calls addTank(formData)
   ↓
6. Store updates: tanks = [...tanks, newTank]
   ↓
7. TankList re-renders (subscribed to tanks)
   ↓
8. New tank appears in grid
```

**Visual:**

```
┌──────────────────────────┐
│  TanksPage (Route)       │
├──────────────────────────┤
│  ┌──────────────────┐    │
│  │ TankForm         │    │  ← User fills form
│  │ [Input] [Button] │────┼─→ addTank(data)
│  └──────────────────┘    │
│                          │
│  ┌──────────────────┐    │
│  │ TankList         │    │  ← Subscribes to store
│  │ [Card] [Card]    │◄───┼─── tanks array
│  └──────────────────┘    │
└──────────────────────────┘
         ↕
   useTankStore
   { tanks: [...] }
```

## 7.2 Component Communication

**❌ BAD - Direct prop passing:**

```typescript
// TanksPage
const [tanks, setTanks] = useState([])

<TankForm onAdd={(tank) => setTanks([...tanks, tank])} />
<TankList tanks={tanks} onDelete={(id) => ...} />
// → Prop drilling hell when app grows
```

**✅ GOOD - Shared store:**

```typescript
// TanksPage
<TankForm />   // Accesses useTankStore internally
<TankList />   // Accesses useTankStore internally
// → No prop drilling, scales well
```

---

## 7.3 Routing Flow

**URL navigation:**

```
User clicks <Link to="/tanks">
  ↓
TanStack Router intercepts (client-side)
  ↓
Router matches route: tanks.tsx
  ↓
Renders TanksPage component
  ↓
Browser URL updates: /tanks
  ↓
No page reload! (SPA)
```

**Type safety:**

```typescript
<Link to="/tanks">Tanks</Link>      // ✅ OK
<Link to="/tankz">Tanks</Link>      // ❌ TS Error: Route doesn't exist
```

---

# 8. Development Workflow

## 8.1 Starting Development

```bash
# 1. Install dependencies (first time only)
yarn install

# 2. Start dev server
yarn dev

# → Opens http://localhost:5173
# → Hot reload enabled (changes reflect immediately)
```

## 8.2 Making Changes

**Scenario: Add new field to Tank**

```typescript
// 1. Update types
// src/features/tank/types.ts
export type Tank = {
  // ... existing fields
  description: string  // ← New field
}

// 2. Update form
// src/features/tank/components/TankForm.tsx
const [formData, setFormData] = useState({
  // ... existing fields
  description: ''  // ← Add to initial state
})

// Add input
<Input
  value={formData.description}
  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
/>

// 3. Update display
// src/features/tank/components/TankList.tsx
<div>Description: {tank.description}</div>

// 4. Save → Hot reload updates UI immediately
```

## 8.3 Committing Code

```bash
# 1. Check changes
git status
git diff

# 2. Stage changes
git add .

# 3. Try to commit
git commit -m "add description field to tanks"

# → Husky runs:
#   - ESLint checks code
#   - Prettier formats code
#   - If pass → Commit succeeds
#   - If fail → Commit blocked, fix errors
```

---

# 9. Common Tasks

## 9.1 Add New Route

```bash
# 1. Create route file
cat > src/routes/about.tsx << 'EOF'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About
})

function About() {
  return <div>About Page</div>
}
EOF

# 2. Dev server auto-generates routeTree.gen.ts
# 3. Visit http://localhost:5173/about
```

## 9.2 Add New Feature

```bash
# 1. Create feature folder
mkdir -p src/features/log/{components,hooks}

# 2. Create types
cat > src/features/log/types.ts << 'EOF'
export type Log = {
  id: string
  tankId: string
  type: 'water-change' | 'trim' | 'maintenance'
  date: Date
  notes: string
}
EOF

# 3. Create store (similar to tank/store.ts)
# 4. Create components
# 5. Export via index.ts
```

## 9.3 Add shadcn Component

```bash
# List available components
npx shadcn add

# Add specific component
npx shadcn add dropdown-menu

# → Creates: src/shared/ui/dropdown-menu.tsx
# → Auto-configured, ready to use
```

## 9.4 Check Code Quality

```bash
# Check types
yarn build  # Runs tsc -b

# Check linting
yarn lint

# Format code
yarn format

# All checks (before commit)
yarn lint && yarn build
```

---

# 10. Quiz & Exercises

## 10.1 Quiz Questions

**Q1:** What happens when you create `src/routes/profile.tsx`?

<details>
<summary>Answer</summary>

- TanStack Router plugin scans the file
- Auto-generates route in `routeTree.gen.ts`
- Route becomes available at `/profile`
- TypeScript knows the route exists (autocomplete)
</details>

**Q2:** Why can't features cross-import?

<details>
<summary>Answer</summary>

- Maintains feature isolation
- Prevents coupling
- Makes features independently testable
- ESLint rule blocks it at commit time
</details>

**Q3:** Where should you put a reusable Button component?

<details>
<summary>Answer</summary>

`src/shared/ui/button.tsx` - Because it's:

- Reusable across features
- Presentational (no business logic)
- Part of design system
</details>

**Q4:** What's the difference between `useState` and `useTankStore`?

<details>
<summary>Answer</summary>

- `useState`: Local component state
- `useTankStore`: Global state shared across components
- `useState` resets on unmount
- `useTankStore` persists while app runs
</details>

**Q5:** Can routes create Zustand stores?

<details>
<summary>Answer</summary>

❌ No! ESLint rule blocks it:
`🚫 Routes should not create stores. Move business logic to features/`

</details>

---

## 10.2 Hands-on Exercises

### Exercise 1: Add a field to Tank

**Task:** Add "waterType" field (Freshwater/Saltwater)

<details>
<summary>Solution</summary>

```typescript
// 1. types.ts
export type Tank = {
  // ... existing
  waterType: 'freshwater' | 'saltwater'
}

// 2. TankForm.tsx
const [formData, setFormData] = useState({
  // ... existing
  waterType: 'freshwater' as const
})

// Add select input
<select
  value={formData.waterType}
  onChange={(e) => setFormData({ ...formData, waterType: e.target.value as any })}
>
  <option value="freshwater">Freshwater</option>
  <option value="saltwater">Saltwater</option>
</select>

// 3. TankList.tsx
<div>Water: {tank.waterType}</div>
```

</details>

---

### Exercise 2: Create a new route

**Task:** Create `/settings` page with "Settings Page" text

<details>
<summary>Solution</summary>

```typescript
// src/routes/settings.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings')({
  component: Settings
})

function Settings() {
  return (
    <div>
      <h1>Settings Page</h1>
    </div>
  )
}

// Add link in __root.tsx nav
<Link to="/settings">Settings</Link>
```

</details>

---

### Exercise 3: Test architecture rules

**Task:** Try to create a cross-feature import and verify ESLint blocks it

<details>
<summary>Solution</summary>

```bash
# 1. Create violating file
mkdir -p src/features/log
cat > src/features/log/test.tsx << 'EOF'
import { useTankStore } from '../tank/store'
export function Test() { return <div>Test</div> }
EOF

# 2. Run lint
yarn lint src/features/log/test.tsx

# 3. See error:
# ❌ Features cannot import from other features

# 4. Try to commit
git add src/features/log/test.tsx
git commit -m "test"

# → Blocked by Husky! ✅

# 5. Clean up
rm src/features/log/test.tsx
```

</details>

---

## 10.3 Debugging Tips

**Issue:** Component doesn't re-render when store updates

```typescript
// ❌ BAD
const store = useTankStore() // Subscribes to EVERYTHING
const tanks = store.tanks

// ✅ GOOD
const tanks = useTankStore((state) => state.tanks) // Only subscribes to tanks
```

**Issue:** TypeScript error "Cannot find module '@/...'"

```bash
# Check tsconfig.app.json has:
"baseUrl": ".",
"paths": { "@/*": ["./src/*"] }

# Restart TypeScript server in VSCode:
Cmd+Shift+P → "TypeScript: Restart TS Server"
```

**Issue:** Route not found

```bash
# Check:
1. File is in src/routes/
2. File exports: export const Route = createFileRoute(...)
3. Dev server is running (auto-generates routeTree.gen.ts)
4. No TypeScript errors in the file
```

---

# 🎓 You're Done!

## What you learned:

✅ **Config files** - package.json, tsconfig, vite.config, etc.
✅ **Project structure** - features/, shared/, routes/
✅ **Routing** - TanStack Router, file-based
✅ **State management** - Zustand stores
✅ **Architecture** - Feature-based, isolation, boundaries
✅ **Development workflow** - Dev server, commits, quality checks

## Next steps:

1. **Implement Log feature** - Practice what you learned
2. **Implement Timeline** - Aggregate data from features
3. **Implement Insights** - Rule-based engine
4. **Experiment** - Break things, see what happens, fix them

## Resources:

- [TanStack Router Docs](https://tanstack.com/router)
- [Zustand Docs](https://zustand-demo.pmnd.rs/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- Project docs: `ARCHITECTURE.md`, `CODE_QUALITY.md`

**Remember:** The best way to learn is by doing. Start implementing! 🚀
