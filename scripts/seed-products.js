/**
 * Seed Initial Products to MongoDB
 * Run this script to populate your database with sample products
 * 
 * Usage: node scripts/seed-products.js
 */

const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/thehouseofrare?retryWrites=true&w=majority'

const productSchema = new mongoose.Schema({
  name: String,
  subtitle: String,
  description: String,
  longDescription: String,
  mrp: Number,
  price: Number,
  discount: Number,
  images: [String],
  colors: [String],
  sizes: [String],
  category: String,
  features: [String],
  fabricCare: [String],
  rating: Number,
  reviews: Number,
  inStock: Boolean,
  stockQuantity: Number,
  sku: String,
}, { timestamps: true })

const Product = mongoose.models.Product || mongoose.model('Product', productSchema)

const sampleProducts = [
  {
    name: "REGULAR FIT GRAPHIC PRINT SWEATSHIRT",
    subtitle: "LOBO - NAVY",
    description: "Elevate your casual wardrobe with our Regular Fit Graphic Print Sweatshirt. Made from premium cotton blend fabric.",
    longDescription: "Crafted with care and attention to detail, this sweatshirt is designed to be your go-to choice for everyday comfort. The regular fit ensures a relaxed silhouette that moves with you, while the soft fabric provides warmth without compromising breathability.",
    mrp: 4499,
    price: 3959,
    discount: 12,
    images: [
      "https://cdn.shopify.com/s/files/1/0752/6435/files/LAURELLIGHTTURQ-CC1380_900x.webp?v=1743582326",
      "https://thehouseofrare.com/cdn/shop/files/LOBONAVY00798HERO-vmake.webp?v=1743582715",
      "https://thehouseofrare.com/cdn/shop/files/WALEDUSKYPINK01251.webp?v=1743581644",
    ],
    colors: ["Navy", "Black", "Grey", "Dusky Pink"],
    sizes: ["XS-36", "S-38", "M-40", "L-42", "XL-44", "XXL-46"],
    category: "Hoodies",
    features: [
      "Premium Cotton Blend (80% Cotton, 20% Polyester)",
      "Regular Fit for Comfortable Wear",
      "Graphic Print on Back and Sleeves",
      "Ribbed Cuffs and Hem",
      "Machine Washable",
    ],
    fabricCare: [
      "Machine wash cold with similar colors",
      "Do not bleach",
      "Tumble dry low",
      "Iron on low heat if needed",
    ],
    rating: 4.5,
    reviews: 128,
    inStock: true,
    stockQuantity: 50,
    sku: "SWEAT-001",
  },
  {
    name: "PREMIUM OVERSIZED HOODIE",
    subtitle: "URBAN - BLACK",
    description: "Stay comfortable and stylish with our premium oversized hoodie. Perfect for streetwear enthusiasts.",
    longDescription: "This oversized hoodie combines comfort with contemporary style. Made from high-quality fleece fabric, it features a relaxed fit that's perfect for layering. The heavyweight construction provides excellent warmth while maintaining breathability.",
    mrp: 5499,
    price: 4399,
    discount: 20,
    images: [
      "https://cdn.shopify.com/s/files/1/0752/6435/files/LAURELLIGHTTURQ-CC1380_900x.webp?v=1743582326",
      "https://thehouseofrare.com/cdn/shop/files/LOBONAVY00798HERO-vmake.webp?v=1743582715",
    ],
    colors: ["Black", "Navy", "Grey", "Olive"],
    sizes: ["S-38", "M-40", "L-42", "XL-44", "XXL-46"],
    category: "Hoodies",
    features: [
      "100% Premium Cotton Fleece",
      "Oversized Fit",
      "Kangaroo Pocket",
      "Adjustable Drawstring Hood",
      "Heavyweight 400 GSM",
    ],
    fabricCare: [
      "Machine wash cold",
      "Do not bleach",
      "Tumble dry low",
      "Iron inside out",
    ],
    rating: 4.7,
    reviews: 256,
    inStock: true,
    stockQuantity: 75,
    sku: "HOOD-001",
  },
]

async function seedProducts() {
  try {
    console.log('🔄 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    console.log('🗑️  Clearing existing products...')
    await Product.deleteMany({})
    console.log('✅ Cleared existing products')

    console.log('📦 Inserting sample products...')
    const products = await Product.insertMany(sampleProducts)
    console.log(`✅ Inserted ${products.length} products`)

    console.log('\n📊 Products added:')
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ₹${product.price}`)
    })

    console.log('\n✨ Database seeding complete!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seedProducts()
