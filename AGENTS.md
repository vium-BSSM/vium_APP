# Project Development Rules

## Expo Version
Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

## Project Structure

### Import Path Rules
- Use `@/` alias for all imports from `src/` directory
- Asset imports: `@/../assets/` for files in the `assets/` directory
- Example:
  ```tsx
  import { Button } from '@/shared/ui';
  const icon = require('@/../assets/icons/photo-icon.svg');
  ```

### Directory Structure
```
src/
├── app/              # Expo Router pages
│   ├── providers/    # App-level providers (fonts, themes, etc.)
│   └── *.tsx        # Route pages
├── shared/
│   └── ui/          # Shared UI components
└── ...

assets/
├── fonts/           # Paperlogy font files
└── icons/           # SVG icon files
```

## Styling Rules

### Design System
All design tokens are defined in `tailwind.config.js`:
- **Colors**: primary, secondary, neutral, text
- **Font sizes**: title, subtitle, text16, text15, text14
- **Font family**: Paperlogy (default sans)

### NativeWind + Tailwind CSS
- Use `className` prop for all styling
- Follow Tailwind utility classes
- Do NOT create separate CSS/style files
- Font weights map to Paperlogy variants automatically:
  - `font-normal` → Paperlogy-Regular (400)
  - `font-medium` → Paperlogy-Medium (500)
  - `font-semibold` → Paperlogy-SemiBold (600)
  - `font-bold` → Paperlogy-Bold (700)

### Example Component Styling
```tsx
<View className="flex-1 bg-white px-4">
  <Text className="text-title font-bold text-text-100">
    Title
  </Text>
  <Text className="text-text14 text-text-200">
    Body text
  </Text>
</View>
```

## Font Management

### Paperlogy Font
- All Paperlogy fonts are loaded in `src/app/providers/index.tsx`
- Fonts are registered in `app.json` under expo-font plugin
- Available weights: 100 (Thin) ~ 900 (Black)
- Default font family is set in `tailwind.config.js`

### Adding New Fonts
1. Place `.ttf` files in `assets/fonts/`
2. Register in `app.json` expo-font plugin
3. Load in `src/app/providers/index.tsx` using `useFonts` hook
4. Update `tailwind.config.js` if needed

## Component Rules

### Shared UI Components
- Location: `src/shared/ui/`
- Always export from `src/shared/ui/index.ts`
- Use TypeScript interfaces for props
- Follow existing component patterns

### Component Props Pattern
```tsx
interface ComponentProps {
  variant?: 'primary' | 'secondary';
  style?: any;  // Allow custom styles
}

export const Component: React.FC<ComponentProps> = ({
  variant = 'primary',
  style,
}) => {
  return <View className="..." style={style}>...</View>;
};
```

### Export Pattern
```tsx
// Component file
export const Button = ...

// index.ts
export { Button } from './Button';
export { Input } from './Input';
```

## Asset Management

### Images and Icons
- SVG icons: `assets/icons/`
- Images: `assets/`
- Import using `require()`:
  ```tsx
  const icon = require('@/../assets/icons/icon-name.svg');
  <Image source={icon} />
  ```

### Asset Organization
- Icons: Use SVG format for scalability
- Images: Use appropriate format (PNG, SVG)
- Follow naming convention: `kebab-case.svg`

## Configuration Files

### Do NOT Modify Unless Necessary
- `babel.config.js` - Module resolver and aliases configured
- `tailwind.config.js` - Design system tokens
- `tsconfig.json` - TypeScript paths configured
- `metro.config.js` - Metro bundler configuration

### Safe to Modify
- `app.json` - App configuration and plugins
- `package.json` - Dependencies
- `src/app/providers/index.tsx` - App providers

## Development Workflow

### Before Creating Components
1. Check Figma design system
2. Use existing components from `@/shared/ui` if possible
3. Follow design tokens from `tailwind.config.js`
4. Match exact spacing, colors, and typography from Figma

### Adding New Features
1. Create page in `src/app/`
2. Use shared components from `@/shared/ui`
3. Follow existing patterns
4. Use `@/` import alias

### Debug and Testing
- Debug page: `src/app/debug.tsx` (accessible at `/debug`)
- Use for component showcase and testing
- Keep updated with new components

## Common Patterns

### State Management
```tsx
import { useState } from 'react';

const [value, setValue] = useState('');
```

### Form Inputs
```tsx
<InputBox
  type="email"
  value={email}
  onChangeText={setEmail}
  showCheck={isValid}
/>
```

### Navigation
```tsx
import { useRouter } from 'expo-router';

const router = useRouter();
router.push('/path');
```

## Don'ts

❌ Do NOT create separate CSS/SCSS files
❌ Do NOT use inline styles (use `className` instead)
❌ Do NOT create files in `src/shared/config/` (use `tailwind.config.js`)
❌ Do NOT use relative imports beyond 2 levels (use `@/` alias)
❌ Do NOT modify font files or remove font loading logic
❌ Do NOT create components outside `src/shared/ui/` without reason
