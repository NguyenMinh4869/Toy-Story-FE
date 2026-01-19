# Swagger Types - Quick Reference

## 🚀 Quick Commands

```bash
# Generate types from Swagger
npm run generate-types

# Build (auto-generates types first)
npm run build
```

## 📦 Import Types

```typescript
// Products
import type { ViewProductDto } from '../types/ProductDTO'

// Brands
import type { ViewBrandDto } from '../types/BrandDTO'

// Categories
import type { ViewCategoryDto } from '../types/CategoryDTO'

// Promotions
import type { ViewPromotionDto } from '../types/PromotionDTO'

// Cart
import type { CartDto, CartItemDto } from '../types/CartDTO'
```

## ⚡ When to Regenerate

- ✅ After backend DTO changes
- ✅ Before production builds
- ✅ When you see type errors
- ✅ After deploying backend updates

## 🔍 Check Swagger

- **UI**: https://toy-story-xwni.onrender.com/swagger
- **JSON**: https://toy-story-xwni.onrender.com/swagger/v1/swagger.json

## ⚠️ Remember

- ❌ **DON'T** edit `src/types/generated.ts` (auto-generated)
- ✅ **DO** use exported types from `*DTO.ts` files
- ✅ **DO** handle `null` values (use `??` operator)

---

📖 **Full Guide**: See `docs/SWAGGER_TYPES_GUIDE.md`

