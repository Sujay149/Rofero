"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Package,
  ShoppingCart,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Clock,
  DollarSign,
  BarChart3,
} from "lucide-react"

interface Stats {
  totalProducts: number
  totalOrders: number
  pendingOrders: number
  revenue: number
  cancelledOrders: number
  deliveredOrders: number
}

interface Product {
  _id: string
  name: string
  price: number
  mrp: number
  stockQuantity: number
  inStock: boolean
  images: string[]
  category: string
  createdAt: string
}

interface Order {
  _id: string
  orderNumber: string
  userEmail: string
  total: number
  orderStatus: string
  paymentStatus: string
  createdAt: string
  items: any[]
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders">("overview")
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0,
    cancelledOrders: 0,
    deliveredOrders: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [orderFilter, setOrderFilter] = useState("all")

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const [productsRes, ordersRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/orders"),
      ])

      const productsData = await productsRes.json()
      const ordersData = await ordersRes.json()

      if (productsData.success) {
        setProducts(productsData.products || [])
      }

      if (ordersData.success) {
        setOrders(ordersData.orders || [])
        calculateStats(ordersData.orders || [], productsData.products || [])
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (ordersData: Order[], productsData: Product[]) => {
    const totalRevenue = ordersData.reduce((sum, order) => sum + order.total, 0)
    const pending = ordersData.filter((o) => o.orderStatus === "pending").length
    const cancelled = ordersData.filter((o) => o.orderStatus === "cancelled").length
    const delivered = ordersData.filter((o) => o.orderStatus === "delivered").length

    setStats({
      totalProducts: productsData.length,
      totalOrders: ordersData.length,
      pendingOrders: pending,
      revenue: totalRevenue,
      cancelledOrders: cancelled,
      deliveredOrders: delivered,
    })
  }

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchDashboardData()
        alert("Product deleted successfully")
      }
    } catch (error) {
      alert("Failed to delete product")
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      paid: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = orderFilter === "all" || order.orderStatus === orderFilter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1 text-sm">Manage products, orders, and analytics</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm"
            >
              View Website
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 sm:space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition whitespace-nowrap ${
                activeTab === "overview"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <BarChart3 className="inline w-5 h-5 mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition whitespace-nowrap ${
                activeTab === "products"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Package className="inline w-5 h-5 mr-2" />
              Products ({stats.totalProducts})
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition whitespace-nowrap ${
                activeTab === "orders"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <ShoppingCart className="inline w-5 h-5 mr-2" />
              Orders ({stats.totalOrders})
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Revenue</p>
                        <p className="text-2xl font-bold mt-1">₹{stats.revenue.toLocaleString("en-IN")}</p>
                      </div>
                      <div className="p-3 bg-green-100 rounded-full">
                        <DollarSign className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">All time earnings</p>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Orders</p>
                        <p className="text-2xl font-bold mt-1">{stats.totalOrders}</p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-full">
                        <ShoppingCart className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <p className="text-xs text-green-600 mt-4">{stats.deliveredOrders} delivered</p>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Pending Orders</p>
                        <p className="text-2xl font-bold mt-1">{stats.pendingOrders}</p>
                      </div>
                      <div className="p-3 bg-yellow-100 rounded-full">
                        <Clock className="w-6 h-6 text-yellow-600" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">Requires action</p>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Products</p>
                        <p className="text-2xl font-bold mt-1">{stats.totalProducts}</p>
                      </div>
                      <div className="p-3 bg-purple-100 rounded-full">
                        <Package className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">In inventory</p>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
                  <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-700">Order ID</th>
                          <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-700">Customer</th>
                          <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-700">Amount</th>
                          <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-700">Status</th>
                          <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-700">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map((order) => (
                          <tr key={order._id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-2 sm:px-4 font-medium">{order.orderNumber}</td>
                            <td className="py-3 px-2 sm:px-4">{order.userEmail}</td>
                            <td className="py-3 px-2 sm:px-4 font-semibold">₹{order.total.toLocaleString("en-IN")}</td>
                            <td className="py-3 px-2 sm:px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                                {order.orderStatus}
                              </span>
                            </td>
                            <td className="py-3 px-2 sm:px-4 text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === "products" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-2xl font-bold">Products Management</h2>
                  <Link
                    href="/admin/products/new"
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition flex items-center gap-2 w-full sm:w-auto justify-center"
                  >
                    <Plus className="w-5 h-5" />
                    Add Product
                  </Link>
                </div>

                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-4 px-4 sm:px-6 font-semibold text-gray-700">Product</th>
                          <th className="text-left py-4 px-4 sm:px-6 font-semibold text-gray-700">Price</th>
                          <th className="text-left py-4 px-4 sm:px-6 font-semibold text-gray-700">Stock</th>
                          <th className="text-left py-4 px-4 sm:px-6 font-semibold text-gray-700">Status</th>
                          <th className="text-left py-4 px-4 sm:px-6 font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product._id} className="border-b hover:bg-gray-50">
                            <td className="py-4 px-4 sm:px-6">
                              <div className="flex items-center gap-3">
                                <img src={product.images[0] || "/placeholder.svg"} alt={product.name} className="w-12 h-12 object-cover rounded" />
                                <div>
                                  <p className="font-medium">{product.name}</p>
                                  <p className="text-xs text-gray-500">{product.category}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 sm:px-6">
                              <div>
                                <p className="font-semibold">₹{product.price.toLocaleString("en-IN")}</p>
                                <p className="text-xs text-gray-400 line-through">₹{product.mrp.toLocaleString("en-IN")}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4 sm:px-6">
                              <p className="font-medium">{product.stockQuantity} units</p>
                            </td>
                            <td className="py-4 px-4 sm:px-6">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                {product.inStock ? "In Stock" : "Out of Stock"}
                              </span>
                            </td>
                            <td className="py-4 px-4 sm:px-6">
                              <div className="flex items-center gap-2">
                                <Link href={`/admin/products/${product._id}`} className="p-2 hover:bg-gray-100 rounded transition" title="Edit">
                                  <Edit className="w-4 h-4" />
                                </Link>
                                <Link href={`/product/${product._id}`} className="p-2 hover:bg-gray-100 rounded transition" title="View" target="_blank">
                                  <Eye className="w-4 h-4" />
                                </Link>
                                <button onClick={() => deleteProduct(product._id)} className="p-2 hover:bg-red-50 text-red-600 rounded transition" title="Delete">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-2xl font-bold">Orders Management</h2>
                  <div className="flex gap-3 w-full sm:w-auto flex-col sm:flex-row">
                    <div className="relative flex-1 sm:flex-none">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border rounded-lg text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                    <select
                      value={orderFilter}
                      onChange={(e) => setOrderFilter(e.target.value)}
                      className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-4 px-4 sm:px-6 font-semibold text-gray-700">Order ID</th>
                          <th className="text-left py-4 px-4 sm:px-6 font-semibold text-gray-700">Customer</th>
                          <th className="text-left py-4 px-4 sm:px-6 font-semibold text-gray-700">Items</th>
                          <th className="text-left py-4 px-4 sm:px-6 font-semibold text-gray-700">Amount</th>
                          <th className="text-left py-4 px-4 sm:px-6 font-semibold text-gray-700">Payment</th>
                          <th className="text-left py-4 px-4 sm:px-6 font-semibold text-gray-700">Status</th>
                          <th className="text-left py-4 px-4 sm:px-6 font-semibold text-gray-700">Date</th>
                          <th className="text-left py-4 px-4 sm:px-6 font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order) => (
                          <tr key={order._id} className="border-b hover:bg-gray-50">
                            <td className="py-4 px-4 sm:px-6">
                              <p className="font-medium">{order.orderNumber}</p>
                            </td>
                            <td className="py-4 px-4 sm:px-6">
                              <p>{order.userEmail}</p>
                            </td>
                            <td className="py-4 px-4 sm:px-6">
                              <p>{order.items?.length || 0} items</p>
                            </td>
                            <td className="py-4 px-4 sm:px-6">
                              <p className="font-semibold">₹{order.total.toLocaleString("en-IN")}</p>
                            </td>
                            <td className="py-4 px-4 sm:px-6">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.paymentStatus)}`}>
                                {order.paymentStatus}
                              </span>
                            </td>
                            <td className="py-4 px-4 sm:px-6">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                                {order.orderStatus}
                              </span>
                            </td>
                            <td className="py-4 px-4 sm:px-6">
                              <p className="text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </td>
                            <td className="py-4 px-4 sm:px-6">
                              <Link
                                href={`/admin/orders/${order._id}`}
                                className="px-3 py-1.5 bg-black text-white text-xs rounded hover:bg-gray-800 transition"
                              >
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {filteredOrders.length === 0 && (
                    <div className="text-center py-12">
                      <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">No orders found</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
