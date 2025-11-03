import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IOrderItem {
  productId: mongoose.Types.ObjectId
  name: string
  price: number
  quantity: number
  size?: string
  color?: string
  image: string
}

export interface IOrder extends Document {
  userId: string
  userEmail: string
  orderNumber: string
  items: IOrderItem[]
  shippingAddress: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
  }
  paymentMethod: string
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  subtotal: number
  tax: number
  total: number
  trackingNumber?: string
  cancelReason?: string
  createdAt: Date
  updatedAt: Date
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
    orderNumber: { type: String, required: true, unique: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        size: { type: String },
        color: { type: String },
        image: { type: String },
      },
    ],
    shippingAddress: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    trackingNumber: { type: String },
    cancelReason: { type: String },
  },
  {
    timestamps: true,
  }
)

OrderSchema.index({ orderNumber: 1 })
OrderSchema.index({ userId: 1 })
OrderSchema.index({ userEmail: 1 })
OrderSchema.index({ orderStatus: 1 })

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema)

export default Order
