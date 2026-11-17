// Product types
export interface Product {
  id: string
  seller_id: string
  category_id: string
  brand_id?: string
  name: string
  slug: string
  description: string
  price: number
  original_price?: number
  stock: number
  is_featured: boolean
  is_active: boolean
  images: string[]
  tags: string[]
  rating: number
  review_count: number
  sold_count: number
  created_at: string
  updated_at: string
  category?: Category
  brand?: Brand
  seller?: Seller
  variants?: ProductVariant[]
}

export interface ProductVariant {
  id: string
  product_id: string
  size?: string
  color?: string
  color_hex?: string
  stock: number
  price_adjustment: number
  sku: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
  parent_id?: string
  is_active: boolean
  sort_order: number
  created_at: string
  children?: Category[]
}

export interface Brand {
  id: string
  name: string
  slug: string
  logo_url?: string
  description?: string
  is_featured: boolean
  is_active: boolean
  created_at: string
}

// User types
export interface User {
  id: string
  email: string
  full_name: string
  phone?: string
  avatar_url?: string
  role: 'customer' | 'seller' | 'admin'
  created_at: string
  updated_at: string
}

export interface Address {
  id: string
  user_id: string
  label: string
  recipient_name: string
  phone: string
  province: string
  city: string
  district: string
  postal_code: string
  full_address: string
  is_primary: boolean
}

// Seller types
export interface Seller {
  id: string
  user_id: string
  store_name: string
  store_slug: string
  store_description?: string
  logo_url?: string
  banner_url?: string
  province: string
  city: string
  rating: number
  review_count: number
  total_sales: number
  is_verified: boolean
  is_active: boolean
  created_at: string
}

// Cart types
export interface CartItem {
  id: string
  cart_id: string
  product_id: string
  variant_id?: string
  quantity: number
  price: number
  product?: Product
  variant?: ProductVariant
}

export interface Cart {
  id: string
  user_id: string
  items: CartItem[]
  total_items: number
  total_price: number
}

// Order types
export interface Order {
  id: string
  order_number: string
  customer_id: string
  status: OrderStatus
  total_amount: number
  shipping_cost: number
  payment_status: PaymentStatus
  payment_method?: string
  shipping_address: Address
  tracking_number?: string
  created_at: string
  updated_at: string
  items?: OrderItem[]
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  variant_id?: string
  quantity: number
  price: number
  product?: Product
  variant?: ProductVariant
}

// Review types
export interface Review {
  id: string
  product_id: string
  user_id: string
  order_id: string
  rating: number
  comment: string
  images?: string[]
  is_verified: boolean
  created_at: string
  user?: User
}

// Wishlist
export interface WishlistItem {
  id: string
  user_id: string
  product_id: string
  created_at: string
  product?: Product
}

// Filter & Sort types
export interface ProductFilter {
  category?: string
  brand?: string
  min_price?: number
  max_price?: number
  sizes?: string[]
  colors?: string[]
  rating?: number
  in_stock?: boolean
}

export type SortOption = 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'popular' | 'rating'

// API response types
export interface ApiResponse<T> {
  data: T | null
  error: string | null
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  total_pages: number
}

// Payment types (Simulation)
export interface PaymentSimulation {
  order_id: string
  amount: number
  payment_method: 'bank_transfer' | 'qris' | 'ewallet' | 'credit_card'
  status: 'pending' | 'success' | 'failed'
  virtual_account?: string
  qr_code?: string
  expires_at: string
}

// Shipping types (Simulation)
export interface ShippingOption {
  courier: string
  service: string
  description: string
  cost: number
  etd: string
}

export interface ShippingTracking {
  tracking_number: string
  status: string
  history: TrackingHistory[]
}

export interface TrackingHistory {
  date: string
  time: string
  description: string
  location: string
}
