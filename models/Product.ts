import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IProduct extends Document {
  name: string
  subtitle?: string
  description: string
  longDescription?: string
  mrp: number
  price: number
  discount: number
  images: string[]
  colors: string[]
  sizes: string[]
  category: string
  gender: string
  features: string[]
  fabricCare: string[]
  rating: number
  reviews: number
  inStock: boolean
  stockQuantity: number
  sku?: string
  sizeChart?: {
    headers: string[]
    rows: string[][]
  }
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String, required: true },
    longDescription: { type: String },
    mrp: { type: Number, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    images: [{ type: String }],
    colors: [{ type: String }],
    sizes: [{ type: String }],
    category: { type: String, default: 'Hoodies' },
    gender: { type: String, default: 'Unisex' },
    features: [{ type: String }],
    fabricCare: [{ type: String }],
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    stockQuantity: { type: Number, default: 0 },
    sku: { type: String },
    sizeChart: {
      headers: [{ type: String }],
      rows: [[{ type: String }]],
    },
  },
  {
    timestamps: true,
  }
)

ProductSchema.index({ name: 'text', description: 'text' })

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema)

export default Product
