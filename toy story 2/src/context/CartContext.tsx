import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import {
  addToCartServer,
  updateCartServer,
  removeFromCartServer,
  clearCartServer,
  getCartServer,
} from '../services/cartService'
import type { CartItemDto, CartProduct, SetSubItemDto } from '../types/CartDTO'
import { useAuth } from '@/hooks/useAuth'

export interface CartItem {
  product: CartProduct
  quantity: number
  serverTotalPrice?: number
  originalUnitPrice?: number
  originalTotalPrice?: number
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (productId?: number, setId?: number, quantity?: number) => void
  removeFromCart: (item: CartItem) => void
  updateQuantity: (item: CartItem, quantity: number) => void
  clearCart: () => void
  refreshCart: () => Promise<void>
  getTotalPrice: () => number
  getTotalOriginalPrice: () => number
  getTotalItems: () => number
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = (): CartContextType => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}

interface CartProviderProps {
  children: ReactNode
}

const mapDtoToCartItem = (dto: CartItemDto): CartItem => {
  if (dto.itemType === "product") {
    return {
      product: {
        productId: dto.productId!,
        name: dto.productName!,
        imageUrl: dto.productImage,
        price: dto.unitPrice,
      },
      quantity: dto.quantity,
      serverTotalPrice: dto.totalPrice,
      originalUnitPrice: dto.originalUnitPrice,
      originalTotalPrice: dto.originalTotalPrice,
    }
  } else {
    return {
      product: {
        setId: dto.setId!,
        name: dto.setName!,
        imageUrl: dto.setImage,
        price: dto.unitPrice,
        subItems: dto.subItems,
      },
      quantity: dto.quantity,
      serverTotalPrice: dto.totalPrice,
      originalUnitPrice: dto.originalUnitPrice,
      originalTotalPrice: dto.originalTotalPrice,
    }
  }
}


export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { isAuthenticated } = useAuth();

  const loadServerCart = async (): Promise<void> => {
    try {
      const cart = await getCartServer()
      setCartItems(cart?.items?.map(mapDtoToCartItem) ?? [])
    } catch (error) {
      console.error('Failed to load cart:', error)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadServerCart()
    }
  }, [isAuthenticated])

  // Refresh cart when user returns to tab or window (e.g. after changing promotions)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAuthenticated) {
        loadServerCart()
      }
    }
    const handleFocus = () => {
      if (isAuthenticated) {
        loadServerCart()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [isAuthenticated])

  const addToCart = (productId?: number, setId?: number, quantity: number = 1): void => {
    addToCartServer(productId, setId, quantity)
      .then(async () => {
        await loadServerCart()
        setIsCartOpen(true)
      })
      .catch((error) => {
        console.error('Failed to add to cart:', error)
      })
  }

  const removeFromCart = (item: CartItem): void => {
    if ("productId" in item.product) {
      removeFromCartServer(item.product.productId, undefined).then(loadServerCart)
    } else {
      removeFromCartServer(undefined, item.product.setId).then(loadServerCart)
    }
  }

  const updateQuantity = (item: CartItem, quantity: number): void => {
    if (quantity <= 0) {
      removeFromCart(item)
      return
    }
    if ("productId" in item.product) {
      updateCartServer(item.product.productId, undefined, quantity).then(loadServerCart)
    } else {
      updateCartServer(undefined, item.product.setId, quantity).then(loadServerCart)
    }
  }

  const clearCart = (): void => {
    clearCartServer().then(() => setCartItems([])).catch(() => { })
  }

  const refreshCart = (): Promise<void> => loadServerCart()

  const getTotalPrice = (): number =>
    cartItems.reduce((total, item) => total + (item.serverTotalPrice ?? ((item.product.price ?? 0) * item.quantity)), 0)

  const getTotalOriginalPrice = (): number =>
    cartItems.reduce((total, item) => total + (item.originalTotalPrice ?? item.serverTotalPrice ?? ((item.product.price ?? 0) * item.quantity)), 0)

  const getTotalItems = (): number =>
    cartItems.reduce((total, item) => total + item.quantity, 0)

  const openCart = (): void => {
    if (!isAuthenticated) {
      setIsCartOpen(true)
      return
    }
    loadServerCart()
      .finally(() => setIsCartOpen(true))
  }
  const closeCart = (): void => setIsCartOpen(false)

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refreshCart,
    getTotalPrice,
    getTotalOriginalPrice,
    getTotalItems,
    isCartOpen,
    openCart,
    closeCart
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
