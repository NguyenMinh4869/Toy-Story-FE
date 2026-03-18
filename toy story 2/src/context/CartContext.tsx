import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ProductDTO } from '../types/ProductDTO'
import {
  addToCartServer,
  updateCartServer,
  removeFromCartServer,
  clearCartServer,
  getCartServer,
} from '../services/cartService'
import type { CartItemDto } from '../types/CartDTO'

export interface CartItem {
  product: ProductDTO
  quantity: number
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (productId?: number, setId?: number, quantity?: number) => void
  removeFromCart: (productId?: number, setId?: number) => void
  updateQuantity: (productId?: number, setId?: number, quantity?: number) => void
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
  const isProduct = dto.itemType === "product"
  return {
    product: {
      productId: isProduct ? dto.productId : undefined,
      setId: !isProduct ? dto.setId : undefined,
      id: String(isProduct ? dto.productId : dto.setId),
      name: isProduct ? dto.productName : dto.setName,
      imageUrl: isProduct ? dto.productImage : dto.setImage,
      price: dto.unitPrice,
    } as ProductDTO,
    quantity: dto.quantity,
  }
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const loadServerCart = async (): Promise<void> => {
    try {
      const cart = await getCartServer()
      setCartItems(cart.items.map(mapDtoToCartItem))
    } catch {
      // silent fail
    }
  }

  useEffect(() => {
    loadServerCart()
  }, [])

  const addToCart = (productId?: number, setId?: number, quantity: number = 1): void => {
    addToCartServer(productId, setId, quantity).then(loadServerCart).catch(() => { })
    setIsCartOpen(true)
  }

  const removeFromCart = (productId?: number, setId?: number): void => {
    removeFromCartServer(productId, setId).then(loadServerCart).catch(() => { })
  }

  const updateQuantity = (productId?: number, setId?: number, quantity?: number): void => {
    if (quantity! <= 0) {
      removeFromCart(productId, setId)
      return
    }
    updateCartServer(productId, setId, quantity).then(loadServerCart).catch(() => { })
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
