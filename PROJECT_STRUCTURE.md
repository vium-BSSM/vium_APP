# Vium App - FSD Architecture Structure

## Project Overview

This project uses **Feature-Sliced Design (FSD)** architecture with **Expo Router** for navigation.

## Directory Structure

```
vium_app/
├── app/                    # Expo Router (file-based routing)
│   ├── _layout.tsx        # Root layout with providers
│   └── index.tsx          # Home route
│
├── src/                   # FSD Architecture layers
│   ├── app/              # Application layer
│   │   ├── providers/    # Global providers (theme, store, etc.)
│   │   └── styles/       # Global styles
│   │
│   ├── pages/            # Page compositions
│   │   └── [page-name]/
│   │       ├── ui/       # Page components
│   │       └── index.ts
│   │
│   ├── widgets/          # Complex UI blocks
│   │   └── [widget-name]/
│   │       ├── ui/       # Widget components
│   │       ├── model/    # Widget logic
│   │       └── index.ts
│   │
│   ├── features/         # User interactions
│   │   └── [feature-name]/
│   │       ├── ui/       # Feature components
│   │       ├── model/    # Feature logic
│   │       └── index.ts
│   │
│   ├── entities/         # Business entities
│   │   └── [entity-name]/
│   │       ├── model/    # Types, state
│   │       ├── api/      # Entity API
│   │       ├── ui/       # Entity UI
│   │       └── index.ts
│   │
│   └── shared/           # Reusable code
│       ├── ui/           # UI components
│       ├── lib/          # Utilities, hooks
│       ├── api/          # API client
│       ├── config/       # Configuration
│       └── types/        # Shared types
│
├── babel.config.js       # Babel configuration with path aliases
├── tsconfig.json         # TypeScript configuration
└── package.json
```

## Key Concepts

### 1. Separation of Concerns

- **`/app` directory**: Expo Router file-based routing only
- **`/src` directory**: All application logic following FSD layers

### 2. Import Rules

Each layer can only import from layers below it:

```
app → pages → widgets → features → entities → shared
```

**Examples:**
- ✅ `pages` can import from `widgets`, `features`, `entities`, `shared`
- ✅ `features` can import from `entities`, `shared`
- ❌ `entities` CANNOT import from `features`
- ❌ `shared` CANNOT import from any FSD layer

### 3. Path Aliases

Use `@/` to import from `src/`:

```tsx
// ✅ Good
import { Button } from '@/shared/ui';
import { HomePage } from '@/pages/home';

// ❌ Bad
import { Button } from '../../../shared/ui';
```

## Layer Purposes

### `app/` (Application)
Global setup: providers, themes, store initialization.

### `pages/` (Pages)
Full page compositions that combine widgets and features.

### `widgets/` (Widgets)
Large, composite UI blocks (Header, ProductCard, etc.).

### `features/` (Features)
User interactions (auth, add-to-cart, toggle-theme).

### `entities/` (Entities)
Business data models (User, Product, Order).

### `shared/` (Shared)
Reusable utilities, UI kit, API client.

## Expo Router Integration

Routes are defined in `/app` directory but use pages from `src/pages`:

```tsx
// /app/profile.tsx
import { ProfilePage } from '@/pages/profile';

export default function Profile() {
  return <ProfilePage />;
}
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```

3. **Create a new feature:**
   ```bash
   mkdir -p src/features/my-feature/ui
   mkdir -p src/features/my-feature/model
   ```

## Best Practices

1. **Keep layers independent**: Don't skip layers in imports
2. **Use barrel exports**: Export from `index.ts` in each slice
3. **Follow naming conventions**: Use descriptive, action-based names
4. **Public API**: Only export what's needed via `index.ts`
5. **Segment structure**: Organize code into `ui/`, `model/`, `api/` segments

## Resources

- [Feature-Sliced Design Documentation](https://feature-sliced.design/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
