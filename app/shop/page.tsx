"use client"

import { useState, useMemo, useEffect } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ProductCard from "@/components/product-card"
import { ChevronDown } from "lucide-react"

interface Product {
  _id: string
  name: string
  price: number
  mrp: number
  images: string[]
  colors: string[]
  sizes: string[]
  category: string
  inStock: boolean
  discount: number
}

const priceRanges = [
  { label: "All Prices", min: 0, max: Number.POSITIVE_INFINITY },
  { label: "₹0 - ₹2000", min: 0, max: 2000 },
  { label: "₹2000 - ₹2500", min: 2000, max: 2500 },
  { label: "₹2500+", min: 2500, max: Number.POSITIVE_INFINITY },
]

export default function ShopPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedPrice, setSelectedPrice] = useState({ min: 0, max: Number.POSITIVE_INFINITY })
  const [sortBy, setSortBy] = useState("newest")
  const [showFilters, setShowFilters] = useState(false)

  // Fetch products from MongoDB
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/admin/products")
        const data = await res.json()
        console.log("Products API response:", data)
        if (data.success && data.products) {
          setAllProducts(data.products || [])
        }
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(allProducts.map((p) => p.category))
    return ["All", ...Array.from(cats)]
  }, [allProducts])

  const filteredProducts = useMemo(() => {
    let filtered = allProducts

    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    filtered = filtered.filter((p) => p.price >= selectedPrice.min && p.price <= selectedPrice.max)

    // Apply sorting
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price)
    }

    return filtered
  }, [allProducts, selectedCategory, selectedPrice, sortBy])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-lg">Loading products...</p>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="bg-white">
        {/* Page Header */}
        <div className="border-b border-gray-200 px-4 md:px-6 py-6 md:py-8 max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Our Collection</h1>
          <p className="text-sm md:text-base text-gray-600">Discover our exclusive range of premium products</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Filters Sidebar */}
            <div className={`${showFilters ? "block" : "hidden"} lg:block lg:col-span-1`}>
              <div className="space-y-6 bg-white lg:bg-transparent p-4 lg:p-0 rounded-lg lg:rounded-none border lg:border-0 border-gray-200">
                {/* Categories */}
                <div className="border-b pb-6">
                  <h3 className="font-bold mb-4 text-sm md:text-base">Category</h3>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`block w-full text-left px-3 py-2 text-sm rounded transition ${
                          selectedCategory === cat
                            ? "bg-black text-white font-semibold"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="border-b pb-6">
                  <h3 className="font-bold mb-4 text-sm md:text-base">Price Range</h3>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <button
                        key={range.label}
                        onClick={() => setSelectedPrice({ min: range.min, max: range.max })}
                        className={`block w-full text-left px-3 py-2 text-sm rounded transition ${
                          selectedPrice.min === range.min && selectedPrice.max === range.max
                            ? "bg-black text-white font-semibold"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* Sort Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 pb-4 md:pb-6 border-b gap-3 sm:gap-4">
                <div>
                  <p className="text-sm text-gray-600">
                    Showing <span className="font-semibold">{filteredProducts.length}</span> products
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <label className="text-sm text-gray-600 whitespace-nowrap">Sort by:</label>
                    <div className="relative flex-1 sm:flex-none">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none w-full sm:w-auto px-3 md:px-4 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black pr-8"
                      >
                        <option value="newest">Newest</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                      </select>
                      <ChevronDown
                        size={16}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden w-full sm:w-auto px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100 font-medium"
                  >
                    {showFilters ? "Hide" : "Show"} Filters
                  </button>
                </div>
              </div>

              {/* Products */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {filteredProducts.map((product) => (
                    <ProductCard 
                      key={product._id} 
                      product={{
                        id: product._id,
                        name: product.name,
                        price: product.price,
                        image: product.images[0] || "/placeholder.jpg",
                        colors: product.colors,
                      }} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-base md:text-lg">No products found matching your filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
