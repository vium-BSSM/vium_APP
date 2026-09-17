# Project Development Rules

## Expo Version
Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

## Project Structure

### FSD (Feature-Sliced Design) Architecture
This project follows **Feature-Sliced Design** architecture principles. All code must be organized according to FSD layers and rules.

#### FSD Layers (from top to bottom)
1. **app/** - Application initialization (providers, router setup)
2. **pages/** - Route pages (one page per route)
3. **widgets/** - Composite UI blocks (shared across multiple pages)
4. **features/** - Business logic features (user scenarios, domain logic)
5. **shared/** - Reusable utilities and UI components (no business logic)

#### FSD Rules
- **Feature folder structure**:
  ```
  features/{feature-name}/
  ├── api/          # API calls for this feature
  ├── lib/          # Business logic, hooks, utils
  ├── types/        # TypeScript types for this feature
  ├── ui/           # Feature-specific UI components
  └── index.ts      # Public exports
  ```
- **Shared layer structure**:
  ```
  shared/
  ├── api/          # Base API client (axios instance)
  ├── ui/           # Reusable UI components (no business logic)
  └── lib/          # Generic utilities (formatters, validators)
  ```
- **Import rules**:
  - Lower layers can NOT import from upper layers
  - Features can NOT import from other features directly
  - Shared layer can NOT contain business logic
  - All feature exports must go through `index.ts` (Public API)
- **What goes where**:
  - Feature-specific types → `features/{name}/types/`
  - Feature API calls → `features/{name}/api/`
  - Feature hooks → `features/{name}/lib/`
  - Feature UI components → `features/{name}/ui/`
  - Generic UI components → `shared/ui/`
  - Base API client → `shared/api/`

#### Example: Ingredient Feature
```
features/ingredient/
├── api/
│   └── ingredientsApi.ts       # getIngredients(), registerIngredient()
├── lib/
│   ├── dateUtils.ts            # calculateStatus(), formatDday()
│   ├── ingredientMapper.ts     # Backend to frontend mapping
│   ├── useIngredientsList.ts   # List management hook
│   ├── useIngredientRegister.ts # Registration hook
│   └── useIngredientDetail.ts  # Detail fetching hook
├── types/
│   └── index.ts                # FridgeItem, IngredientApiResponse
├── ui/
│   ├── FridgeGrid.tsx          # Grid display component
│   └── FridgeHeader.tsx        # Header component
└── index.ts                    # Export all public APIs
```

### Import Path Rules
- Use `@/` alias for all imports from `src/` directory
- Asset imports: `@/../assets/` for files in the `assets/` directory
- **Always import from feature's public API** (`features/{name}/index.ts`)
- Example:
  ```tsx
  // ✅ CORRECT
  import { useIngredientsList, FridgeGrid } from '@/features/ingredient';
  import { Button } from '@/shared/ui';

  // ❌ INCORRECT - Don't bypass public API
  import { useIngredientsList } from '@/features/ingredient/lib/useIngredientsList';
  ```

### Directory Structure
```
src/
├── app/              # Expo Router + App initialization
│   ├── providers/    # App-level providers (fonts, themes, etc.)
│   └── *.tsx        # Route files
├── pages/            # Page components (one per route)
│   └── {page}/
│       └── ui/       # Page UI components
├── widgets/          # Composite UI blocks (shared across pages)
├── features/         # Business features
│   └── {feature}/
│       ├── api/      # API calls
│       ├── lib/      # Business logic, hooks, utils
│       ├── types/    # Feature types
│       ├── ui/       # Feature UI components
│       └── index.ts  # Public API
└── shared/           # Reusable code (no business logic)
    ├── api/          # Base API client
    ├── ui/           # Generic UI components
    └── lib/          # Generic utilities

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
- **IMPORTANT**: Always add `font-sans` class to all `<Text>` components to apply Paperlogy font
- For `<TextInput>`, add both `font-sans` class AND `style={{ fontFamily: 'Paperlogy' }}`
- Font weights map to Paperlogy variants automatically:
  - `font-normal` → Paperlogy-Regular (400)
  - `font-medium` → Paperlogy-Medium (500)
  - `font-semibold` → Paperlogy-SemiBold (600)
  - `font-bold` → Paperlogy-Bold (700)

### Example Component Styling
```tsx
<View className="flex-1 bg-white px-4">
  <Text className="text-title font-bold text-text-100 font-sans">
    Title
  </Text>
  <Text className="text-text14 text-text-200 font-sans">
    Body text
  </Text>
  <TextInput
    className="text-text15 font-sans"
    style={{ fontFamily: 'Paperlogy' }}
    placeholder="Input text"
  />
</View>
```

## Font Management

### Paperlogy Font
- All Paperlogy fonts are loaded in `src/providers/AppProvider.tsx`
- Fonts are registered in `app.json` under expo-font plugin
- Available weights: 100 (Thin) ~ 900 (Black)
- Default font family is set in `tailwind.config.js`
- **CRITICAL**: Base 'Paperlogy' key must be registered in `useFonts` for NativeWind to work

### Font Loading Configuration
```tsx
// src/providers/AppProvider.tsx
const [fontsLoaded] = useFonts({
  'Paperlogy': require('@/../assets/fonts/Paperlogy-4Regular.ttf'),  // Base key is required!
  'Paperlogy-Thin': require('@/../assets/fonts/Paperlogy-1Thin.ttf'),
  'Paperlogy-Regular': require('@/../assets/fonts/Paperlogy-4Regular.ttf'),
  // ... other weights
});
```

### Adding New Fonts
1. Place `.ttf` files in `assets/fonts/`
2. Register in `app.json` expo-font plugin
3. Load in `src/providers/AppProvider.tsx` using `useFonts` hook
4. Update `tailwind.config.js` if needed
5. Add base font key (e.g., 'Paperlogy') in addition to weight-specific keys

## Component Rules

### Shared UI Components
- Location: `src/shared/ui/`
- Always export from `src/shared/ui/index.ts`
- Use TypeScript interfaces for props
- Follow existing component patterns

### Available Components
- **Button**: Primary action button with fullWidth option
- **InputBox**: Email/password input with validation check
- **LabelInput**: Form input with label (used in forms)
- **ImageUpload**: Image upload with camera icon button
- **Card**: Item card with default/empty variants
- **StateBall**: Status indicator (위험/보통/굿)
- **StatusBadge**: Status badge display
- **DetailInfoRow**: Label-value pair row
- **Check**: Checkmark icon
- **Banner**: Banner component
- **AddButton**: Floating action button with icons
- **NavBar**: Navigation bar

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
- **IMPORTANT**: SVG files must be imported as components, NOT using require()
- **CORRECT** SVG import:
  ```tsx
  import BackIcon from '@/../assets/icons/back-icon.svg';
  <BackIcon width={30} height={30} />
  ```
- **INCORRECT** SVG import:
  ```tsx
  // ❌ DO NOT DO THIS
  const icon = require('@/../assets/icons/back-icon.svg');
  <Image source={icon} />
  ```
- For raster images (PNG, JPG), use `expo-image`:
  ```tsx
  import { Image } from 'expo-image';
  <Image source={{ uri: imageUrl }} contentFit="cover" className="w-full h-full" />
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

## API Integration

### Axios Configuration
This project uses **axios** for all HTTP requests. The base client is configured in `shared/api/client.ts`.

#### Base API Client Setup
```tsx
// src/shared/api/client.ts
import axios from 'axios';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl
  || process.env.EXPO_PUBLIC_API_BASE_URL
  || 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

#### Environment Variables
Configure API endpoint in `.env`:
```
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080
```

And in `app.json`:
```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "http://localhost:8080"
    }
  }
}
```

### Creating Feature APIs
API functions should be in `features/{feature}/api/`:

```tsx
// features/ingredient/api/ingredientsApi.ts
import { apiClient } from '@/shared/api/client';
import { IngredientsListApiResponse, IngredientRegisterRequest } from '../types';

export const getIngredients = async (
  expiringSoon: boolean = false
): Promise<IngredientsListApiResponse> => {
  const response = await apiClient.get<IngredientsListApiResponse>(
    '/api/me/ingredients',
    { params: { expiringSoon } }
  );
  return response.data;
};

export const registerIngredient = async (
  request: IngredientRegisterRequest
): Promise<IngredientRegisterApiResponse> => {
  const response = await apiClient.post<IngredientRegisterApiResponse>(
    '/api/me/ingredients',
    request
  );
  return response.data;
};

export const getIngredientDetail = async (
  id: number
): Promise<IngredientDetailApiResponse> => {
  const response = await apiClient.get<IngredientDetailApiResponse>(
    `/api/me/ingredients/${id}`
  );
  return response.data;
};
```

### Using APIs in Hooks
Wrap API calls in custom hooks in `features/{feature}/lib/`:

```tsx
// features/ingredient/lib/useIngredientsList.ts
import { useState, useEffect } from 'react';
import { getIngredients } from '../api/ingredientsApi';
import { FridgeItem } from '../types';

export const useIngredientsList = () => {
  const [items, setItems] = useState<FridgeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadIngredients = async (expiringSoon: boolean = false) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getIngredients(expiringSoon);

      if (response.success && response.data) {
        setItems(mapIngredientsToFridgeItems(response.data.ingredients));
      } else {
        setError(response.error?.message || '데이터를 불러올 수 없습니다.');
      }
    } catch (err) {
      console.error('Failed to load ingredients:', err);
      setError('서버와 연결할 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadIngredients();
  }, []);

  return { items, isLoading, error, refresh: loadIngredients };
};
```

### Data Transformation
Create mapper functions to transform backend responses to frontend types:

```tsx
// features/ingredient/lib/ingredientMapper.ts
import { IngredientApiResponse, FridgeItemDetail } from '../types';
import { calculateStatus, formatDday, formatDate } from './dateUtils';

export const mapIngredientToFridgeItem = (
  ingredient: IngredientApiResponse
): FridgeItemDetail => {
  const status = calculateStatus(ingredient.expiresOn);
  const subtitle = formatDday(ingredient.expiresOn);

  return {
    id: ingredient.inventoryItemId,
    title: ingredient.name,
    subtitle,
    status,
    quantity: `${ingredient.remainingQuantity}${ingredient.unit}`,
    price: '3,000원', // Hardcoded until backend provides this
    registeredDate: formatDate(ingredient.purchasedOn),
    expirationDate: formatDate(ingredient.expiresOn),
  };
};
```

### API Error Handling
```tsx
try {
  const response = await apiClient.post('/api/endpoint', data);
  if (response.data.success) {
    // Handle success
  } else {
    // Handle API-level error
    console.error('API Error:', response.data.error);
  }
} catch (error) {
  // Handle network/axios error
  if (axios.isAxiosError(error)) {
    console.error('Request failed:', error.response?.status);
  }
}
```

## Common Patterns

### State Management
```tsx
import { useState } from 'react';

const [value, setValue] = useState('');
```

### Form Inputs
```tsx
// Email/Password Input
<InputBox
  type="email"
  value={email}
  onChangeText={setEmail}
  showCheck={isValid}
/>

// Label Input (for forms)
<LabelInput
  label="양"
  value={amount}
  onChangeText={setAmount}
  placeholder="입력하세요"
/>

// Image Upload
<ImageUpload
  imageUri={imageUri}
  onPress={handleImagePick}
/>
```

### Navigation
```tsx
import { useRouter } from 'expo-router';

const router = useRouter();
router.push('/path');
router.back();

// For dynamic routes, use 'as any' to avoid type errors
router.push('/fridge/add' as any);
```

### Image Picker (expo-image-picker)
```tsx
import * as ImagePicker from 'expo-image-picker';

const handleImagePick = async () => {
  // Request permission
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('권한 필요', '사진 라이브러리 접근 권한이 필요합니다.');
    return;
  }

  // Launch image picker
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: 'images' as any,
    allowsEditing: true,
    aspect: [16, 9],
    quality: 1,
  });

  if (!result.canceled && result.assets[0]) {
    setImageUri(result.assets[0].uri);
  }
};
```

### React State Updates and Navigation
**IMPORTANT**: Avoid updating state before navigation to prevent React errors
```tsx
// ❌ INCORRECT - causes "Can't perform a React state update" error
const handleNavItemPress = (item) => {
  setActiveNavItem(item);  // State update
  router.push('/main');     // Navigation - component unmounts
};

// ✅ CORRECT - only update state if staying on current page
const handleNavItemPress = (item) => {
  if (item === 'home') {
    router.push('/main');
  } else {
    setActiveNavItem(item);  // Only update if not navigating
  }
};
```

## Don'ts

### General
❌ Do NOT create separate CSS/SCSS files
❌ Do NOT use inline styles (use `className` instead)
❌ Do NOT hardcode colors or font sizes (use tailwind tokens: `text-text16`, `text-neutral-200`, etc.)
❌ Do NOT create files in `src/shared/config/` (use `tailwind.config.js`)
❌ Do NOT use relative imports beyond 2 levels (use `@/` alias)
❌ Do NOT modify font files or remove font loading logic
❌ Do NOT use `react-native` Image component (use `expo-image` instead for raster images)
❌ Do NOT use `resizeMode` prop (use `contentFit` with expo-image)
❌ Do NOT use `require()` for SVG files (import as components instead)
❌ Do NOT update state before navigating with router (causes React errors)
❌ Do NOT use fixed widths without `max-w-*` for responsive layouts

### FSD Architecture
❌ Do NOT put business logic in `shared/` layer
❌ Do NOT put feature-specific types in `shared/types/`
❌ Do NOT bypass feature's public API (always import from `features/{name}/index.ts`)
❌ Do NOT import from other features directly (use shared layer or widgets)
❌ Do NOT put API calls in `shared/api/` (only base axios client goes there)
❌ Do NOT create feature-specific UI in `shared/ui/` (use `features/{name}/ui/`)
❌ Do NOT create mock data files in `shared/mock/` (use real API integration)

### API Integration
❌ Do NOT use `fetch()` (use axios via `apiClient` from `@/shared/api/client`)
❌ Do NOT hardcode API URLs (use environment variables)
❌ Do NOT make API calls directly in components (use hooks in `features/{name}/lib/`)
❌ Do NOT ignore error handling in API calls
❌ Do NOT modify backend code to match frontend (transform data in frontend mapper functions)
