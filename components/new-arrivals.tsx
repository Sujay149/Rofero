"use client"

import { useState, useEffect } from "react"
import ProductCard from "./product-card"

interface Product {
  _id: string
  name: string
  price: number
  images: string[]
  colors: string[]
}

export default function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/admin/products?limit=4")
        const data = await res.json()
        console.log("New arrivals API response:", data)
        if (data.success && data.products && Array.isArray(data.products)) {
          // Get the latest 4 products
          setProducts(data.products.slice(0, 4))
        } else {
          setProducts([])
        }
      } catch (error) {
        console.error("Failed to fetch new arrivals:", error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) {
    return (
      <section className="py-12 md:py-16 px-4 md:px-6 max-w-7xl mx-auto bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Loading new arrivals...</p>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <section className="py-12 md:py-16 px-4 md:px-6 max-w-7xl mx-auto bg-gray-50">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">New Arrivals</h2>
        <p className="text-gray-600 text-base md:text-lg">Check out our latest releases</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={{
              id: product._id,
              name: product.name,
              price: product.price,
              image: product.images[0] || "/placeholder.jpg",
              colors: product.colors || [],
            }}
          />
        ))}
      </div>
    </section>
  )
}
