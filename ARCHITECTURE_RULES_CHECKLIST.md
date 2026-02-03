# Feature-Based Architecture - Complete Rules Checklist

## ✅ Currently Implemented

### 1. Feature Isolation

- [x] Features cannot import from other features
- [x] Features can only import via public API (index.ts)

### 2. Dependency Direction

- [x] Shared cannot import from features
- [x] Features can import from shared

### 3. Code Location

- [x] Routes cannot create stores (orchestration only)
- [x] Shared/UI cannot use state management (pure components)

---

## 🔄 Should Implement Next (High Priority)

### 4. File Naming Conventions

- [ ] Components must be PascalCase
- [ ] Hooks must start with 'use'
- [ ] Utils/helpers must be camelCase
- [ ] Types/interfaces must be PascalCase

### 5. Public API Enforcement

- [ ] Features must export through index.ts
- [ ] Direct imports to feature internals should be blocked
- [ ] Only routes can import from feature/index.ts

### 6. Feature Structure Consistency

- [ ] Each feature must have: types.ts, store.ts, index.ts
- [ ] Components must be in components/ folder
- [ ] Hooks must be in hooks/ folder
- [ ] Utils must be in utils/ folder (if exists)

### 7. Cyclic Dependencies

- [ ] Prevent circular imports between files
- [ ] Prevent circular imports between features (already covered)

---

## 📋 Should Implement Later (Medium Priority)

### 8. Store Co-location

- [ ] Each feature can have ONLY ONE store
- [ ] Store must be named `[feature]Store.ts` or `store.ts`
- [ ] No multiple stores per feature (unless justified)

### 9. Component Organization

- [ ] Page components should be in routes/
- [ ] Feature components should be in features/\*/components/
- [ ] Shared components should be in shared/ui/
- [ ] No components directly in feature root

### 10. Type Safety

- [ ] All exports must be typed (no implicit any)
- [ ] Props must have explicit types
- [ ] Store state must be typed

### 11. Testing Co-location

- [ ] Tests should be next to implementation
- [ ] Test files must be _.test.ts or _.spec.ts
- [ ] Each feature should have tests

---

## 🎯 Advanced Rules (Low Priority / Optional)

### 12. Barrel File Optimization

- [ ] Prevent barrel file re-exports (performance)
- [ ] Each module exports directly what it owns

### 13. Feature Flags

- [ ] Features can be toggled on/off
- [ ] Feature folders can have feature-flag.ts

### 14. API Layer Separation

- [ ] API calls should be in services/ or api/ folder
- [ ] Not mixed with components

### 15. Assets Co-location

- [ ] Feature-specific assets in feature folder
- [ ] Global assets in shared/assets/

### 16. Documentation Requirements

- [ ] Each feature must have README.md
- [ ] Complex components need JSDoc

---

## 🔍 Current Project Analysis

### What we have:

```
src/
├── features/
│   └── tank/
│       ├── components/
│       │   ├── TankForm.tsx      ✅ Good location
│       │   └── TankList.tsx      ✅ Good location
│       ├── hooks/                ✅ Folder exists
│       ├── index.ts              ✅ Public API
│       ├── store.ts              ✅ One store
│       └── types.ts              ✅ Types separated
├── shared/
│   ├── ui/                       ✅ UI components
│   ├── lib/                      ✅ Utilities
│   └── hooks/                    ✅ Folder exists
└── routes/                       ✅ Orchestration only
```

### What's missing for full compliance:

#### Missing Rules:

1. ❌ File naming not enforced (could have lowercase component files)
2. ❌ Public API not strictly enforced (can still import internals)
3. ❌ No required structure validation
4. ❌ No cyclic dependency detection
5. ❌ No tests yet

#### Missing Folders/Files:

1. ❌ No tests (\*.test.ts files)
2. ❌ No feature README.md
3. ❌ No services/ or api/ layer yet
4. ❌ log/ and insight/ features not implemented

---

## 💡 Recommendations

### Phase 1 (NOW - Before implementing more features):

1. ✅ **Public API enforcement** - Block direct imports to internals
2. ✅ **File naming conventions** - Enforce PascalCase for components
3. ⚠️ **Structure validation** - Ensure required files exist

### Phase 2 (After implementing Log feature):

4. ⚠️ **Testing requirements** - Each feature needs tests
5. ⚠️ **Cyclic dependency detection** - Plugin needed
6. ⚠️ **Store naming** - Enforce consistent naming

### Phase 3 (When scaling):

7. ⚠️ **API layer separation** - When adding backend calls
8. ⚠️ **Documentation** - When team grows
9. ⚠️ **Feature flags** - When need A/B testing

---

## 🎯 Priority Rules to Add NOW

Based on current project state, add these 3 rules:

### Rule A: Public API Strict Enforcement

```javascript
// Routes can ONLY import from feature/index.ts
// Block: import { TankForm } from '@/features/tank/components/TankForm'
// Allow: import { TankForm } from '@/features/tank'
```

### Rule B: File Naming Conventions

```javascript
// Components: PascalCase (TankForm.tsx, TankList.tsx)
// Hooks: useSomething.ts
// Utils: camelCase.ts
// Stores: store.ts or [feature]Store.ts
```

### Rule C: Required Files in Features

```javascript
// Each feature MUST have:
// - index.ts (public API)
// - types.ts (models)
// Optional but recommended:
// - store.ts (if stateful)
// - components/ (if has UI)
```

---

## ❓ Questions for You

1. **Want to add Priority Rules now?** (A, B, C above)
   - Pro: More strict enforcement from start
   - Con: Might slow down initial development

2. **Or wait until have 2-3 features?**
   - Pro: See patterns emerge first
   - Con: Harder to refactor later

3. **Which rules are most important to you?**
   - Naming conventions?
   - Public API strictness?
   - Testing requirements?
   - Structure validation?

---

My recommendation: **Add Rule A (Public API) NOW**, defer B & C until after Log feature.
