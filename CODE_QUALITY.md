# Code Quality Tools Setup

This project uses automated code quality tools to maintain consistent code style and catch errors early.

## 🛠️ Tools Installed

### ESLint

- Checks code for potential errors and style issues
- Configured for React, TypeScript, and React Hooks
- Runs automatically before each commit

### Prettier

- Automatically formats code for consistency
- Configured with Tailwind CSS class sorting
- Runs automatically before each commit

### Husky

- Manages Git hooks
- Runs linters and formatters before allowing commits
- Ensures only quality code gets committed

### lint-staged

- Only lints/formats files that are staged for commit
- Faster than running on entire codebase
- Configured in `package.json`

## 📋 Available Scripts

```bash
# Run ESLint check
yarn lint

# Run ESLint and auto-fix issues
yarn lint:fix

# Format all code with Prettier
yarn format

# Run dev server
yarn dev

# Build for production
yarn build
```

## 🔄 Pre-commit Workflow

When you run `git commit`, the following happens automatically:

1. **Husky** intercepts the commit
2. **lint-staged** runs on staged files only:
   - ESLint checks and fixes issues
   - Prettier formats code
3. If any errors:
   - ❌ Commit is blocked
   - You see error messages
   - Fix the errors and commit again
4. If everything passes:
   - ✅ Code is automatically formatted
   - ✅ Commit succeeds

## 🎯 Example

```bash
# Make changes to code
$ git add .
$ git commit -m "add new feature"

# Husky runs automatically:
✔ Running tasks for staged files...
✔ ESLint --fix
✔ Prettier --write
[main abc123] add new feature
```

## ⚙️ Configuration Files

- `.prettierrc` - Prettier formatting rules
- `.prettierignore` - Files to skip formatting
- `eslint.config.js` - ESLint rules
- `.husky/pre-commit` - Git pre-commit hook
- `package.json` - lint-staged configuration

## 💡 Tips

- Run `yarn format` before committing if you want to see formatting changes first
- ESLint errors must be fixed manually
- Prettier formatting happens automatically
- Generated files (\*.gen.ts, dist/) are ignored
