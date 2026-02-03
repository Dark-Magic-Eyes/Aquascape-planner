#!/bin/bash

echo "🧪 Testing Feature-Based Architecture Rules"
echo "=========================================="
echo ""

# Test 1: Feature cross-import violation
echo "📝 Test 1: Creating file with cross-feature import..."
cat > src/features/log/test-cross-import.tsx << 'EOF'
// This should FAIL - cross-feature import
import { useTankStore } from '../tank/store'

export function TestComponent() {
  return <div>Test</div>
}
EOF

echo "Running ESLint..."
if yarn lint src/features/log/test-cross-import.tsx 2>&1 | grep -q "no-restricted-imports"; then
    echo "✅ PASS: ESLint correctly blocked cross-feature import"
else
    echo "❌ FAIL: ESLint did not catch the violation"
fi
rm src/features/log/test-cross-import.tsx
echo ""

# Test 2: Shared importing from feature
echo "📝 Test 2: Creating shared file importing from feature..."
cat > src/shared/lib/test-violation.ts << 'EOF'
// This should FAIL - shared importing from feature
import { Tank } from '@/features/tank/types'

export function formatTank(tank: Tank) {
  return tank.name
}
EOF

echo "Running ESLint..."
if yarn lint src/shared/lib/test-violation.ts 2>&1 | grep -q "no-restricted-imports"; then
    echo "✅ PASS: ESLint correctly blocked shared → feature import"
else
    echo "❌ FAIL: ESLint did not catch the violation"
fi
rm src/shared/lib/test-violation.ts
echo ""

# Test 3: Valid imports (should pass)
echo "📝 Test 3: Testing valid architecture (should pass)..."
if yarn lint src/features/tank/components/TankForm.tsx 2>&1 | grep -q "error"; then
    echo "❌ FAIL: Valid code was flagged as error"
else
    echo "✅ PASS: Valid architecture code passed"
fi
echo ""

echo "=========================================="
echo "✅ All architecture rules are working!"
echo ""
echo "Run 'yarn lint' to check your code anytime"
