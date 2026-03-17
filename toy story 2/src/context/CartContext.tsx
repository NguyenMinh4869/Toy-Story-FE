import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ProductDTO } from '../types/ProductDTO'

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

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const localData = localStorage.getItem('cartItems')
      return localData ? JSON.parse(localData) : []
    } catch (error) {
      console.error('Failed to parse cartItems from localStorage', error)
      return []
    }
  })
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems))
    } catch (error) {
      console.error('Failed to save cartItems to localStorage', error)
    }
  }, [cartItems])

  const addToCart = (product: ProductDTO, quantity: number = 1): void => {
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
    setIsCartOpen(true)
  }

  const removeFromCart = (productId: string): void => {
    setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number): void => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = (): void => {
    setCartItems([])
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
