import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import {
  addToCartServer,
  updateCartServer,
  removeFromCartServer,
  clearCartServer,
  getCartServer,
} from '../services/cartService'
import type { CartItemDto, CartProduct } from '../types/CartDTO'
import { useAuth } from '@/hooks/useAuth'

export interface CartItem {
  product: CartProduct
  quantity: number
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (productId?: number, setId?: number, quantity?: number) => void
  removeFromCart: (item: CartItem) => void
  updateQuantity: (item: CartItem, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
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
    }
  } else {
    return {
      product: {
        setId: dto.setId!,
        name: dto.setName!,
        imageUrl: dto.setImage,
        price: dto.unitPrice,
      },
      quantity: dto.quantity,
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
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadServerCart()
    }
  }, [isAuthenticated])

  const addToCart = (productId?: number, setId?: number, quantity: number = 1): void => {
    addToCartServer(productId, setId, quantity).then(loadServerCart).catch(() => { })
    setIsCartOpen(true)
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

  const getTotalPrice = (): number =>
    cartItems.reduce((total, item) => total + ((item.product.price ?? 0) * item.quantity), 0)

  const getTotalItems = (): number =>
    cartItems.reduce((total, item) => total + item.quantity, 0)

  const openCart = (): void => setIsCartOpen(true)
  const closeCart = (): void => setIsCartOpen(false)

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    isCartOpen,
    openCart,
    closeCart
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
