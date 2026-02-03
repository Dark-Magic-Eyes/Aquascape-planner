# Architecture Rules Enforcement

This project uses ESLint to automatically enforce feature-based architecture rules.

## 🚀 Auto-Scaling Rules

**Rules automatically apply to ALL features and enforce clean architecture** - no config changes needed when adding new features!

## 🏗️ Comprehensive Architecture Rules

### 1. ❌ Features Cannot Cross-Import

Features are isolated modules and **cannot import from each other**.

```typescript
// ❌ BAD - Log feature importing from Tank feature
// src/features/log/LogList.tsx
import { useTankStore } from '../tank/store'  // ❌ ERROR!

// ✅ GOOD - If you need shared data, move it to shared/
// src/shared/stores/tankStore.ts
export const useTankStore = create(...)

// Then both features can import from shared/
import { useTankStore } from '@/shared/stores/tankStore'  // ✅ OK
```

**ESLint will block commits with this error:**

```
🚫 Log feature cannot import from other features.
Use shared/ for common code.
```

---

### ❌ Shared Code Cannot Import Features

Shared code must be independent and reusable.

```typescript
// ❌ BAD - Shared importing from feature
// src/shared/utils/helper.ts
import { Tank } from '@/features/tank/types'  // ❌ ERROR!

// ✅ GOOD - Define types in shared if needed by multiple features
// src/shared/types/tank.ts
export type Tank = { ... }
```

**ESLint will block commits with:**

```
🚫 Shared code cannot depend on features.
```

---

## 📁 Allowed Import Patterns

### ✅ Features can import from:

- ✅ `@/shared/ui/*` - UI components
- ✅ `@/shared/lib/*` - Utilities
- ✅ `@/shared/hooks/*` - Custom hooks
- ✅ `@/shared/types/*` - Shared types
- ✅ Same feature (internal imports)

### ✅ Routes can import from:

- ✅ `@/features/*/index.ts` - Feature public API
- ✅ `@/shared/*` - Shared code
- ❌ NOT from feature internals directly

### ✅ Shared can import from:

- ✅ Other shared code
- ✅ External libraries
- ❌ NOT from features

---

## 🎯 Examples

### ✅ Correct Architecture

```typescript
// ✅ Feature importing from shared
// src/features/tank/components/TankForm.tsx
import { Button } from '@/shared/ui/button'
import { useTankStore } from '../store' // Same feature OK

// ✅ Route importing from feature public API
// src/routes/tanks.tsx
import { TankForm, TankList } from '@/features/tank' // Via index.ts

// ✅ Shared code independent
// src/shared/ui/button.tsx
import { cn } from '@/shared/lib/utils' // Shared → shared OK
```

### ❌ Violations (Will be blocked by ESLint)

```typescript
// ❌ Feature cross-import
// src/features/log/LogForm.tsx
import { useTankStore } from '@/features/tank/store' // ❌ ERROR

// ❌ Shared depending on feature
// src/shared/utils/formatter.ts
import { Tank } from '@/features/tank/types' // ❌ ERROR

// ❌ Route importing feature internals
// src/routes/tanks.tsx
import { TankForm } from '@/features/tank/components/TankForm' // ❌ BAD
// Should import via: import { TankForm } from '@/features/tank'
```

---

## 🔧 How It Works

ESLint is configured with **universal patterns** in `eslint.config.js`:

```javascript
// ✅ Universal rule - applies to ANY feature!
{
  files: ['src/features/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            // Block ../other-feature/** pattern
            group: ['../*/!(index).{ts,tsx}', '../*/**'],
            message: '🚫 Features cannot import from other features'
          }
        ]
      }
    ]
  }
}
```

- **Universal pattern**: Works for any feature (tank, log, analytics, etc.)
- **No manual updates**: Add new features without touching ESLint config
- **Shared rules**: Shared code cannot import from features
- **Automatic enforcement**: Runs on every commit via Husky

### When you add a new feature:

```bash
# 1. Create new feature
mkdir src/features/analytics

# 2. ESLint rules automatically apply! ✅
# No need to update eslint.config.js
```

---

## 🚀 Testing Architecture Rules

Try creating a violating file:

```bash
# Create a test file with violation
echo "import { useTankStore } from '../tank/store'" > src/features/log/test.tsx

# Run lint
yarn lint

# You'll see:
# ❌ error  '../tank/store' import is restricted
# 🚫 Log feature cannot import from other features
```

---

## 💡 Benefits

1. **Prevents coupling** between features
2. **Enforces clean architecture** automatically
3. **Catches violations** before code review
4. **Self-documenting** - Rules explain the architecture
5. **Scalable** - Easy to add new features

---

## 📚 Related Docs

- [CODE_QUALITY.md](./CODE_QUALITY.md) - Linting & formatting tools
- [README.md](./README.md) - Project overview

---

### 2. ❌ Routes: Only Orchestration, No Business Logic

Routes should only compose features, not implement logic.

```typescript
// ❌ BAD - Creating store in route
// src/routes/tanks.tsx
import { create } from 'zustand'

const useLocalStore = create(() => ({ count: 0 }))  // ❌ ERROR!

export function TanksPage() {
  const count = useLocalStore(state => state.count)
  return <div>{count}</div>
}
```

**ESLint error:**

```
🚫 Routes should not create stores.
Move business logic to features/
```

**✅ CORRECT:**

```typescript
// src/routes/tanks.tsx
import { TankForm, TankList } from '@/features/tank'  // ✅ Orchestrate features

export function TanksPage() {
  return (
    <div>
      <TankForm />
      <TankList />
    </div>
  )
}
```

---

### 3. ❌ Shared/UI: Pure Components Only

Shared UI components must be presentational, no state management.

```typescript
// ❌ BAD - State management in shared component
// src/shared/ui/SearchBox.tsx
import { create } from 'zustand'  // ❌ ERROR!

const useSearchStore = create(() => ({ query: '' }))

export function SearchBox() {
  const query = useSearchStore(state => state.query)
  return <input value={query} />
}
```

**ESLint error:**

```
🚫 Shared UI components should not use state management.
Keep them pure/presentational.
```

**✅ CORRECT:**

```typescript
// src/shared/ui/SearchBox.tsx
type Props = {
  value: string
  onChange: (value: string) => void
}

export function SearchBox({ value, onChange }: Props) {
  return <input value={value} onChange={e => onChange(e.target.value)} />
}
```

---

## 📋 Complete Rules Summary

| Rule                     | Enforced On    | What It Prevents                          |
| ------------------------ | -------------- | ----------------------------------------- |
| **No cross-imports**     | `features/**`  | Features importing from other features    |
| **Shared independence**  | `shared/**`    | Shared code depending on features         |
| **Routes orchestration** | `routes/**`    | Business logic in routes (store creation) |
| **UI purity**            | `shared/ui/**` | State management in shared components     |

---

## 🎯 Where to Put Code

### ✅ Feature-specific code → `features/[name]/`

```
features/tank/
├── components/     # Tank-specific UI
├── store.ts        # Tank business logic
├── types.ts        # Tank models
└── index.ts        # Public API
```

### ✅ Reusable UI → `shared/ui/`

```
shared/ui/
├── button.tsx      # Pure button component
├── card.tsx        # Pure card component
└── input.tsx       # Pure input component
```

### ✅ Utilities → `shared/lib/`

```
shared/lib/
├── utils.ts        # Helper functions
├── validators.ts   # Validation logic
└── formatters.ts   # Formatting functions
```

### ✅ Routes → `routes/`

```
routes/
├── __root.tsx      # Layout only
├── index.tsx       # Compose features
└── tanks.tsx       # Compose Tank feature
```

---
