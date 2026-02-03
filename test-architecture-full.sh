#!/bin/bash

echo "🧪 Testing Comprehensive Architecture Rules"
echo "============================================"
echo ""

# Test 1: Cross-feature import (existing test)
echo "📝 Test 1: Features cannot cross-import..."
mkdir -p src/features/log
cat > src/features/log/test1.tsx << 'EOF'
import { useTankStore } from '../tank/store'
export function Test() { return <div>Test</div> }
EOF

if yarn lint src/features/log/test1.tsx 2>&1 | grep -q "Features cannot import from other features"; then
    echo "✅ PASS: Cross-feature import blocked"
else
    echo "❌ FAIL"
fi
rm src/features/log/test1.tsx
echo ""

# Test 2: Shared importing from features
echo "📝 Test 2: Shared cannot import from features..."
cat > src/shared/lib/test2.ts << 'EOF'
import { Tank } from '@/features/tank/types'
export function format(tank: Tank) { return tank.name }
EOF

if yarn lint src/shared/lib/test2.ts 2>&1 | grep -q "Shared code cannot depend on features"; then
    echo "✅ PASS: Shared → feature import blocked"
else
    echo "❌ FAIL"
fi
rm src/shared/lib/test2.ts
echo ""

# Test 3: Routes creating stores (business logic in routes)
echo "📝 Test 3: Routes should not create stores..."
cat > src/routes/test3.tsx << 'EOF'
import { create } from 'zustand'

const useTestStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 }))
}))

export function TestRoute() {
  return <div>Test</div>
}
EOF

if yarn lint src/routes/test3.tsx 2>&1 | grep -q "Routes should not create stores"; then
    echo "✅ PASS: Store creation in routes blocked"
else
    echo "❌ FAIL"
fi
rm src/routes/test3.tsx
echo ""

# Test 4: Shared/UI using state management
echo "📝 Test 4: Shared UI should not use state management..."
cat > src/shared/ui/test4.tsx << 'EOF'
import { create } from 'zustand'

const useLocalStore = create(() => ({ value: 1 }))

export function TestComponent() {
  return <div>Test</div>
}
EOF

if yarn lint src/shared/ui/test4.tsx 2>&1 | grep -q "Shared UI components should not use state management"; then
    echo "✅ PASS: State management in shared/ui blocked"
else
    echo "❌ FAIL"
fi
rm src/shared/ui/test4.tsx
echo ""

# Test 5: Valid architecture
echo "📝 Test 5: Valid code should pass..."
if ! yarn lint src/features/tank/components/TankForm.tsx 2>&1 | grep -q "error.*no-restricted"; then
    echo "✅ PASS: Valid architecture code accepted"
else
    echo "❌ FAIL: Valid code was blocked"
fi
echo ""

echo "============================================"
echo "🎉 Architecture rules comprehensive test complete!"
echo ""
echo "Rules enforced:"
echo "  ✓ Features cannot cross-import"
echo "  ✓ Shared cannot depend on features"
echo "  ✓ Routes cannot create stores"
echo "  ✓ Shared/UI cannot use state management"
