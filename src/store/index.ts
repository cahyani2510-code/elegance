import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, Product, ProductVariant, WishlistItem } from '@/types'

interface CartStore {
  items: CartItem[]
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, variant, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.product_id === product.id && item.variant_id === variant?.id
          )

          if (existingIndex >= 0) {
            const newItems = [...state.items]
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity: newItems[existingIndex].quantity + quantity,
            }
            return { items: newItems }
          }

          const newItem: CartItem = {
            id: `cart-${Date.now()}-${Math.random()}`,
            cart_id: 'local',
            product_id: product.id,
            variant_id: variant?.id,
            quantity,
            price: product.price + (variant?.price_adjustment || 0),
            product,
            variant,
          }

          return { items: [...state.items, newItem] }
        })
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }))
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
    }),
    {
      name: 'elegance-cart',
    }
  )
)

interface WishlistStore {
  items: WishlistItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  toggleItem: (product: Product) => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          if (state.items.some((item) => item.product_id === product.id)) {
            return state
          }
          const newItem: WishlistItem = {
            id: `wish-${Date.now()}`,
            user_id: 'local',
            product_id: product.id,
            created_at: new Date().toISOString(),
            product,
          }
          return { items: [...state.items, newItem] }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product_id !== productId),
        }))
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.product_id === productId)
      },

      toggleItem: (product) => {
        const { isInWishlist, addItem, removeItem } = get()
        if (isInWishlist(product.id)) {
          removeItem(product.id)
        } else {
          addItem(product)
        }
      },
    }),
    {
      name: 'elegance-wishlist',
    }
  )
)

interface AuthStore {
  user: { id: string; email: string; full_name: string; role: string } | null
  isLoading: boolean
  setUser: (user: AuthStore['user']) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}))

interface UIStore {
  isMobileMenuOpen: boolean
  isSearchOpen: boolean
  isCartOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  setSearchOpen: (open: boolean) => void
  setCartOpen: (open: boolean) => void
}

export const useUIStore = create<UIStore>((set) => ({
  isMobileMenuOpen: false,
  isSearchOpen: false,
  isCartOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  setCartOpen: (open) => set({ isCartOpen: open }),
}))
