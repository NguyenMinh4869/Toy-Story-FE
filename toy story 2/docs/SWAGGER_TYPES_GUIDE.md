# Swagger Type Generation Guide

## 📖 Overview

This project uses **Swagger/OpenAPI** to automatically generate TypeScript types from your backend API. Instead of manually maintaining TypeScript interfaces that match your C# DTOs, the types are generated directly from your Swagger specification.

## 🎯 Benefits

- ✅ **Always in sync** - Types match your backend exactly
- ✅ **No manual updates** - Changes to backend DTOs automatically reflect in frontend
- ✅ **Type safety** - Full TypeScript IntelliSense and type checking
- ✅ **Single source of truth** - Your backend Swagger is the source

## 🔧 How It Works

### Architecture

```
Backend (C#) 
    ↓
Swagger/OpenAPI Spec (JSON)
    ↓
openapi-typescript tool
    ↓
TypeScript Types (generated.ts)
    ↓
Your React Components
```

### File Structure

```
src/
  types/
    generated.ts          ← Auto-generated (DO NOT EDIT)
    ProductDTO.ts         ← Exports from generated.ts
    BrandDTO.ts          ← Exports from generated.ts
    CategoryDTO.ts       ← Exports from generated.ts
    PromotionDTO.ts      ← Exports from generated.ts
    CartDTO.ts           ← Exports from generated.ts
    Account.ts           ← Manual types (if needed)
```

## 🚀 Usage

### 1. Generate Types Manually

When you update your backend DTOs, regenerate the types:

```bash
npm run generate-types
```

This command:
- Fetches the latest Swagger JSON from: `https://toy-story-xwni.onrender.com/swagger/v1/swagger.json`
- Generates TypeScript types in `src/types/generated.ts`
- Updates all exported types in individual DTO files

### 2. Automatic Generation

Types are automatically regenerated before builds:

```bash
npm run build  # Runs generate-types first, then builds
```

### 3. Using the Types

Import and use the generated types in your components:

```typescript
import type { ViewProductDto } from '../types/ProductDTO'
import type { ViewBrandDto } from '../types/BrandDTO'
import type { CartDto, CartItemDto } from '../types/CartDTO'

// In your component
const [products, setProducts] = useState<ViewProductDto[]>([])
const [cart, setCart] = useState<CartDto | null>(null)
```

## 📝 Available Types

### Product Types
```typescript
import type { ViewProductDto, ProductDTO } from '../types/ProductDTO'

// ViewProductDto includes:
// - productId, name, description, price
// - imageUrl, origin, material
// - gender, ageRange, status
// - categoryId, categoryName
// - brandId, brandName
```

### Brand Types
```typescript
import type { 
  ViewBrandDto, 
  CreateBrandDto, 
  UpdateBrandDto, 
  FilterBrandDto,
  BrandDTO 
} from '../types/BrandDTO'
```

### Category Types
```typescript
import type { ViewCategoryDto, CategoryDTO } from '../types/CategoryDTO'
```

### Promotion Types
```typescript
import type { 
  ViewPromotionDto, 
  ViewPromotionSummaryDto,
  PromotionDTO 
} from '../types/PromotionDTO'
```

### Cart Types
```typescript
import type { 
  CartDto, 
  CartItemDto,
  CartDTO,
  CartItemDTO 
} from '../types/CartDTO'
```

## 🔄 Workflow

### When Backend Changes

1. **Update your C# DTOs** in the backend
2. **Deploy backend** (Swagger updates automatically)
3. **Run type generation**:
   ```bash
   npm run generate-types
   ```
4. **Fix any type errors** in your frontend code
5. **Test your changes**

### Development Workflow

```bash
# 1. Start development
npm run dev

# 2. If backend changed, regenerate types
npm run generate-types

# 3. TypeScript will show errors if types don't match
# Fix any errors in your components

# 4. Build for production (auto-regenerates types)
npm run build
```

## ⚠️ Important Notes

### DO NOT Edit `generated.ts`

The file `src/types/generated.ts` is **auto-generated**. Any manual changes will be overwritten when you run `generate-types`.

### Use Type Aliases

Instead of importing directly from `generated.ts`, use the exported types:

```typescript
// ✅ Good
import type { ViewProductDto } from '../types/ProductDTO'

// ❌ Bad
import type { components } from '../types/generated'
const product: components['schemas']['ViewProductDto'] = ...
```

### Null vs Undefined

The generated types use `| null` (matching C# nullable types). Handle both:

```typescript
// Generated type: name?: string | null
const productName = product.name ?? 'Unknown' // Handles both null and undefined
```

### Optional Fields

All fields in generated types are optional (`?`) because Swagger marks them as nullable. Always check for existence:

```typescript
if (product.price !== undefined && product.price !== null) {
  const formatted = formatPrice(product.price)
}
```

## 🛠️ Troubleshooting

### Types Not Updating

**Problem**: Changes in backend not reflected in frontend types

**Solution**:
1. Verify Swagger is updated: Visit `https://toy-story-xwni.onrender.com/swagger`
2. Run `npm run generate-types` manually
3. Check if `generated.ts` was updated (check file timestamp)

### Type Errors After Regeneration

**Problem**: TypeScript errors after running `generate-types`

**Solution**:
1. Check what changed in the Swagger spec
2. Update your code to match new types
3. Handle new required/optional fields
4. Update service functions if endpoints changed

### Build Fails

**Problem**: `npm run build` fails with type errors

**Solution**:
1. Run `npm run generate-types` first
2. Fix any type errors
3. Try building again

### Swagger URL Changed

**Problem**: Backend URL changed

**Solution**: Update the URL in `package.json`:

```json
{
  "scripts": {
    "generate-types": "openapi-typescript YOUR_NEW_URL --output src/types/generated.ts"
  }
}
```

## 📚 Best Practices

### 1. Regenerate Types Regularly

Run `generate-types` whenever:
- Backend DTOs change
- New endpoints are added
- Before major releases
- When you see type mismatches

### 2. Use Type Aliases

Create clean exports in individual files (already done):
- `ProductDTO.ts` exports `ViewProductDto`
- `BrandDTO.ts` exports `ViewBrandDto`
- etc.

### 3. Handle Nullable Fields

Always handle `null` and `undefined`:

```typescript
const displayName = product.name ?? 'Unnamed Product'
const price = product.price ?? 0
```

### 4. Type Guards

Create type guards for runtime checks:

```typescript
function isValidProduct(product: ViewProductDto): product is ViewProductDto & { 
  productId: number; 
  name: string; 
  price: number 
} {
  return (
    product.productId !== undefined &&
    product.name !== null &&
    product.price !== undefined
  )
}
```

### 5. Service Layer

Keep service functions typed:

```typescript
// ✅ Good - uses generated types
export const getProductById = async (
  productId: number
): Promise<ViewProductDto> => {
  const response = await apiGet<ViewProductDto>(`/product/${productId}`)
  return response.data
}
```

## 🔍 Checking What Changed

### Compare Generated Types

```bash
# 1. Commit current generated.ts
git add src/types/generated.ts
git commit -m "Current types"

# 2. Regenerate
npm run generate-types

# 3. See what changed
git diff src/types/generated.ts
```

### View Swagger Spec

Visit your Swagger UI to see current API:
- URL: `https://toy-story-xwni.onrender.com/swagger`
- JSON: `https://toy-story-xwni.onrender.com/swagger/v1/swagger.json`

## 🎓 Advanced Usage

### Custom Type Transformations

If you need to transform generated types, create wrapper types:

```typescript
// In ProductDTO.ts
import type { ViewProductDto as GeneratedProductDto } from './generated'

// Transform null to undefined
export type ViewProductDto = {
  [K in keyof GeneratedProductDto]: 
    GeneratedProductDto[K] extends null 
      ? undefined 
      : GeneratedProductDto[K]
}
```

### Type Utilities

Create utility types for common patterns:

```typescript
// utils/types.ts
export type NonNullable<T> = T extends null | undefined ? never : T
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
```

## 📞 Support

If you encounter issues:

1. Check Swagger is accessible
2. Verify `openapi-typescript` is installed: `npm list openapi-typescript`
3. Check TypeScript version compatibility
4. Review error messages carefully

## 🔗 Related Files

- `package.json` - Scripts and dependencies
- `src/types/generated.ts` - Auto-generated types (DO NOT EDIT)
- `src/types/*DTO.ts` - Type exports
- `src/services/*.ts` - API services using the types

---

**Last Updated**: Generated types are always up-to-date with your Swagger spec. Run `npm run generate-types` to refresh.

