'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Package, Plus, DollarSign, TrendingUp, ShoppingBag, Eye, Edit, Trash2, CheckCircle, Clock } from 'lucide-react'
import { mockProducts } from '@/data/mock'
import { formatPrice, cn } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function SellerDashboardPage() {
  const [products, setProducts] = useState(mockProducts.slice(0, 5))
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    category_id: '1',
    price: '',
    stock: '',
    description: '',
  })

  const stats = [
    { title: 'Total Revenue', value: 'Rp 45.850.000', change: '+18.2%', icon: DollarSign },
    { title: 'Active Products', value: products.length.toString(), change: '+2 this month', icon: Package },
    { title: 'Orders Completed', value: '184', change: '+24.5%', icon: ShoppingBag },
    { title: 'Store Rating', value: '4.9 / 5.0', change: '2,847 reviews', icon: TrendingUp },
  ]

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      toast.error('Please fill in required fields')
      return
    }

    const added = {
      id: `p-${Date.now()}`,
      seller_id: '1',
      category_id: newProduct.category_id,
      name: newProduct.name,
      slug: newProduct.name.toLowerCase().replace(/ /g, '-'),
      description: newProduct.description,
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
      is_featured: false,
      is_active: true,
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'],
      tags: ['fashion'],
      rating: 5,
      review_count: 0,
      sold_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    setProducts([added, ...products])
    setShowAddModal(false)
    setNewProduct({ name: '', category_id: '1', price: '', stock: '', description: '' })
    toast.success('Product created successfully!', {
      style: { background: '#111', color: '#fff', border: '1px solid #C6A66B' },
    })
  }

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id))
    toast.success('Product removed')
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] py-8">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16">
        {/* Header */}
        <div className="bg-[#111111] p-6 md:p-8 text-white mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#C6A66B] text-black text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                Seller Center
              </span>
              <span className="text-[#16a34a] text-xs flex items-center gap-1 font-medium">
                <CheckCircle size={12} /> Verified Seller
              </span>
            </div>
            <h1 className="font-serif text-2xl md:text-3xl">Maison Noir Official Store</h1>
            <p className="text-white/60 text-xs font-light mt-1">Manage your catalogue, stock, and orders</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-gold px-5 py-3 text-xs flex items-center gap-2"
          >
            <Plus size={16} /> Add New Product
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ title, value, change, icon: Icon }) => (
            <div key={title} className="bg-white border border-[#e5e1d8] p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[#6b7280] font-light uppercase tracking-wider">{title}</span>
                <Icon size={18} className="text-[#C6A66B]" />
              </div>
              <p className="font-serif text-2xl text-[#111111] font-semibold mb-1">{value}</p>
              <p className="text-xs text-[#16a34a] font-medium">{change}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-[#e5e1d8] mb-6">
          {(['overview', 'products', 'orders'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'pb-3 text-sm tracking-wider uppercase font-light transition-all capitalize',
                activeTab === tab
                  ? 'text-[#111111] font-medium border-b-2 border-[#C6A66B]'
                  : 'text-[#6b7280] hover:text-[#111111]'
              )}
            >
              {tab === 'products' ? `Products (${products.length})` : tab}
            </button>
          ))}
        </div>

        {/* Products Table */}
        {(activeTab === 'products' || activeTab === 'overview') && (
          <div className="bg-white border border-[#e5e1d8] overflow-hidden mb-8">
            <div className="p-4 border-b border-[#e5e1d8] flex justify-between items-center">
              <h3 className="font-medium text-sm text-[#111111] uppercase tracking-wider">Product Inventory</h3>
              <span className="text-xs text-[#6b7280]">{products.length} items total</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[#e5e1d8] bg-[#f8f7f4] text-xs text-[#6b7280] uppercase tracking-wider">
                    <th className="p-4">Product</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Sold</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e1d8]">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-[#f8f7f4] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 flex-shrink-0 bg-[#e5e1d8]">
                            {p.images[0] && (
                              <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="48px" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-[#111111] line-clamp-1">{p.name}</p>
                            <p className="text-xs text-[#6b7280] font-light">SKU: {p.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-[#111111]">{formatPrice(p.price)}</td>
                      <td className="p-4">
                        <span className={cn('font-medium', p.stock <= 5 ? 'text-red-500' : 'text-[#111111]')}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="p-4 text-[#6b7280]">{p.sold_count}</td>
                      <td className="p-4">
                        <span className="bg-green-100 text-green-800 text-[10px] font-semibold uppercase px-2 py-0.5 tracking-wider">
                          Active
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/products/${p.slug}`} className="p-1 text-[#6b7280] hover:text-[#111111]">
                            <Eye size={16} />
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1 text-[#6b7280] hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white border border-[#e5e1d8] p-6 text-center py-12">
            <ShoppingBag size={32} className="text-[#6b7280] mx-auto mb-3" />
            <h3 className="font-serif text-lg text-[#111111] mb-1">Incoming Seller Orders</h3>
            <p className="text-xs text-[#6b7280] font-light">Real-time orders received from customers will appear here.</p>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="font-serif text-xl text-[#111111] mb-4">Add New Product</h3>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#111111] mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="e.g. Linen Blend Shirt"
                    className="w-full border border-[#e5e1d8] px-3 py-2 text-sm focus:border-[#C6A66B]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-[#111111] mb-1">Price (Rp) *</label>
                    <input
                      type="number"
                      required
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="850000"
                      className="w-full border border-[#e5e1d8] px-3 py-2 text-sm focus:border-[#C6A66B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-[#111111] mb-1">Stock *</label>
                    <input
                      type="number"
                      required
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      placeholder="20"
                      className="w-full border border-[#e5e1d8] px-3 py-2 text-sm focus:border-[#C6A66B]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#111111] mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Describe materials, fit, care instructions..."
                    className="w-full border border-[#e5e1d8] px-3 py-2 text-sm focus:border-[#C6A66B]"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 border border-[#e5e1d8] py-2.5 text-xs text-[#6b7280] hover:text-[#111111]"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 btn-gold py-2.5 text-xs">
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
