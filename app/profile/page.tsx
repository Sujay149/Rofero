"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useAuth } from "@/hooks/use-auth"
import { Mail, Phone, MapPin, LogOut, Edit2, Package, Truck, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"

interface Order {
  _id: string
  orderId: string
  items: Array<{
    productId: string
    name: string
    price: number
    quantity: number
    size: string
    color: string
    image: string
  }>
  totalAmount: number
  status: string
  paymentStatus: string
  shippingAddress: {
    fullName: string
    address: string
    city: string
    state: string
    pincode: string
    phone: string
  }
  createdAt: string
  trackingNumber?: string
  estimatedDelivery?: string
}

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [profileData, setProfileData] = useState({
    fullName: user?.displayName || "",
    email: user?.email || "",
    phone: user?.phoneNumber || "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  })

  // Fetch user orders
  useEffect(() => {
    if (user?.email) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/orders?email=${user?.email}`)
      const data = await res.json()
      if (data.success) {
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoadingOrders(false)
    }
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <>
        <Navbar />
        <main className="bg-white min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please Login</h1>
            <p className="text-gray-600 mb-6">You need to be logged in to view your profile.</p>
            <Link
              href="/login"
              className="inline-block bg-black text-white px-6 py-2 rounded hover:bg-gray-900 transition"
            >
              Go to Login
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveProfile = () => {
    setIsEditing(false)
    // Here you would typically make an API call to save the profile data
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <>
      <Navbar />
      <main className="bg-gray-50 min-h-screen py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
                <div className="text-center mb-4 md:mb-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-black rounded-full mx-auto mb-3 md:mb-4 flex items-center justify-center text-white text-xl md:text-2xl font-bold">
                    {user.email ? user.email[0].toUpperCase() : "U"}
                  </div>
                  <h2 className="text-lg md:text-xl font-bold truncate">{profileData.fullName || user.email}</h2>
                  <p className="text-xs md:text-sm text-gray-600 truncate">{user.email}</p>
                </div>

                <nav className="space-y-2">
                  <Link href="/profile" className="block px-3 md:px-4 py-2 bg-black text-white rounded text-sm font-semibold">
                    My Profile
                  </Link>
                  <Link
                    href="/track"
                    className="block px-3 md:px-4 py-2 border border-gray-300 rounded text-sm font-semibold hover:bg-gray-100"
                  >
                    Track Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded text-sm font-semibold hover:bg-gray-100 flex items-center justify-center gap-2"
                  >
                    <LogOut size={14} className="md:w-4 md:h-4" /> Logout
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h2 className="text-xl md:text-2xl font-bold">Personal Information</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 text-sm font-semibold text-black hover:underline"
                  >
                    <Edit2 size={14} className="md:w-4 md:h-4" /> {isEditing ? "Cancel" : "Edit"}
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={profileData.fullName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-3 md:px-4 py-2 text-sm border border-gray-300 rounded ${
                          isEditing ? "focus:outline-none focus:ring-2 focus:ring-black" : "bg-gray-50"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                        <Mail size={14} className="md:w-4 md:h-4" /> Email Address
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        disabled
                        className="w-full px-3 md:px-4 py-2 text-sm border border-gray-300 rounded bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                        <Phone size={14} className="md:w-4 md:h-4" /> Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="+91"
                        className={`w-full px-3 md:px-4 py-2 text-sm border border-gray-300 rounded ${
                          isEditing ? "focus:outline-none focus:ring-2 focus:ring-black" : "bg-gray-50"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Shipping Address</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                      <MapPin size={14} className="md:w-4 md:h-4" /> Full Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={profileData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Street address"
                      className={`w-full px-3 md:px-4 py-2 text-sm border border-gray-300 rounded ${
                        isEditing ? "focus:outline-none focus:ring-2 focus:ring-black" : "bg-gray-50"
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={profileData.city}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-3 md:px-4 py-2 text-sm border border-gray-300 rounded ${
                          isEditing ? "focus:outline-none focus:ring-2 focus:ring-black" : "bg-gray-50"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">State</label>
                      <input
                        type="text"
                        name="state"
                        value={profileData.state}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-2 border border-gray-300 rounded ${
                          isEditing ? "focus:outline-none focus:ring-2 focus:ring-black" : "bg-gray-50"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Pincode</label>
                      <input
                        type="text"
                        name="pincode"
                        value={profileData.pincode}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-2 border border-gray-300 rounded ${
                          isEditing ? "focus:outline-none focus:ring-2 focus:ring-black" : "bg-gray-50"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              {isEditing && (
                <button
                  onClick={handleSaveProfile}
                  className="w-full bg-black text-white py-3 rounded font-semibold hover:bg-gray-900 transition"
                >
                  Save Changes
                </button>
              )}

              {/* My Orders */}
              <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h2 className="text-xl md:text-2xl font-bold">My Orders</h2>
                  <Link
                    href="/my-orders"
                    className="text-sm font-semibold text-black hover:underline"
                  >
                    View All
                  </Link>
                </div>

                {loadingOrders ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">No orders yet. Start shopping now!</p>
                    <Link
                      href="/shop"
                      className="inline-block bg-black text-white px-6 py-2 rounded font-semibold hover:bg-gray-900 transition"
                    >
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
                      <div
                        key={order._id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                          <div>
                            <p className="text-sm text-gray-600">Order ID</p>
                            <p className="font-semibold">{order.orderId}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {order.status === "delivered" && (
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                                <CheckCircle size={14} />
                                Delivered
                              </span>
                            )}
                            {order.status === "shipped" && (
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold flex items-center gap-1">
                                <Truck size={14} />
                                Shipped
                              </span>
                            )}
                            {order.status === "processing" && (
                              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold flex items-center gap-1">
                                <Clock size={14} />
                                Processing
                              </span>
                            )}
                            {order.status === "pending" && (
                              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold flex items-center gap-1">
                                <Clock size={14} />
                                Pending
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-3 mb-3">
                          {order.items.slice(0, 3).map((item, idx) => (
                            <img
                              key={idx}
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded border border-gray-200"
                            />
                          ))}
                          {order.items.length > 3 && (
                            <div className="w-16 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                              <span className="text-xs font-semibold text-gray-600">
                                +{order.items.length - 3}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-200">
                          <div>
                            <p className="text-sm text-gray-600">
                              {order.items.length} item{order.items.length > 1 ? "s" : ""} • ₹
                              {order.totalAmount.toLocaleString("en-IN")}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Ordered on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                          <Link
                            href={`/track?orderId=${order.orderId}`}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-black rounded hover:bg-black hover:text-white transition text-sm font-semibold"
                          >
                            <Truck size={16} />
                            Track Order
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
