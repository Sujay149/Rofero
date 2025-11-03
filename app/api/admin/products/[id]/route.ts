import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/models/Product'

// GET single product
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params

    const product = await Product.findById(id)

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, product })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// PUT - Update product
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const data = await request.json()

    // Recalculate discount if prices changed
    if (data.mrp && data.price) {
      data.discount = Math.round(((data.mrp - data.price) / data.mrp) * 100)
    }

    const product = await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true })

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, product })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// DELETE product
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params

    const product = await Product.findByIdAndDelete(id)

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
