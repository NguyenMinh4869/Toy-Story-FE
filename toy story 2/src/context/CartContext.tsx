import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react'
import { ProductDTO } from '../types/ProductDTO'
import { useAuthContext } from './AuthContext'
import {
  addToCartServer,
  updateCartServer,
  removeFromCartServer,
  clearCartServer,
  getCartServer,
  syncCartServer,
} from '../services/cartService'
import type { CartItemDto } from '../types/CartDTO'

export interface CartItem {
  product: ProductDTO
  quantity: number
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: ProductDTO, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
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
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

interface CartProviderProps {
  children: ReactNode
}

const mapDtoToCartItem = (dto: CartItemDto): CartItem => ({
  product: {
    productId: dto.productId,
    id: String(dto.productId),
    name: dto.productName,
    imageUrl: dto.imageUrl,
    price: dto.unitPrice,
  } as ProductDTO,
  quantity: dto.quantity,
})

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { isAuthenticated } = useAuthContext()
  const prevAuthRef = useRef<boolean>(isAuthenticated)

  const loadServerCart = async (): Promise<void> => {
    try {
      const cart = await getCartServer()
      setCartItems(cart.items.map(mapDtoToCartItem))
    } catch {
      // silent fail - keep current state
    }
  }

  useEffect(() => {
    const wasAuthenticated = prevAuthRef.current
    prevAuthRef.current = isAuthenticated

    if (isAuthenticated && !wasAuthenticated) {
      // Just logged in — sync any local items then load server cart
      const localItems = cartItems
      if (localItems.length > 0) {
        syncCartServer(localItems).then(loadServerCart).catch(loadServerCart)
      } else {
        loadServerCart()
      }
    } else if (!isAuthenticated && wasAuthenticated) {
      // Just logged out — clear cart
      setCartItems([])
    } else if (isAuthenticated) {
      // Initial mount while already authenticated
      loadServerCart()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  const addToCart = (product: ProductDTO, quantity: number = 1): void => {
    if (isAuthenticated) {
      const productId = Number(product.productId ?? product.id)
      addToCartServer(productId, quantity).then(loadServerCart).catch(() => {})
    } else {
      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.product.id === product.id)
        if (existingItem) {
          return prevItems.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        }
        return [...prevItems, { product, quantity }]
      })
    }
    setIsCartOpen(true)
  }

  const removeFromCart = (productId: string): void => {
    if (isAuthenticated) {
      removeFromCartServer(Number(productId)).then(loadServerCart).catch(() => {})
    } else {
      setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId))
    }
  }

  const updateQuantity = (productId: string, quantity: number): void => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    if (isAuthenticated) {
      updateCartServer(Number(productId), quantity).then(loadServerCart).catch(() => {})
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        )
      )
    }
  }

  const clearCart = (): void => {
    if (isAuthenticated) {
      clearCartServer().then(() => setCartItems([])).catch(() => {})
    } else {
      setCartItems([])
    }
  }

  const getTotalPrice = (): number => {
    return cartItems.reduce((total, item) => total + ((item.product.price ?? 0) * item.quantity), 0)
  }

  const getTotalItems = (): number => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const openCart = (): void => {
    setIsCartOpen(true)
  }

  const closeCart = (): void => {
    setIsCartOpen(false)
  }

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
