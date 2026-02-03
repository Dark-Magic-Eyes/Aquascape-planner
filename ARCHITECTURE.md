# Architecture Rules Enforcement

This project uses ESLint to automatically enforce feature-based architecture rules.

## 🏗️ Architecture Rules

### ❌ Features Cannot Cross-Import

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

ESLint is configured with `no-restricted-imports` rules in `eslint.config.js`:

- **Per-feature rules**: Each feature has specific import restrictions
- **Shared rules**: Shared code cannot import from features
- **Automatic enforcement**: Runs on every commit via Husky

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
