import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/models/Product'

// GET all products or search
export async function GET(request: Request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    let query: any = {}

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    if (category && category !== 'all') {
      query.category = category
    }

    const skip = (page - 1) * limit

    const [products, total] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Product.countDocuments(query),
    ])

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Products GET error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// POST - Create new product
export async function POST(request: Request) {
  try {
    await connectDB()

    const data = await request.json()

    // Calculate discount percentage
    if (data.mrp && data.price) {
      data.discount = Math.round(((data.mrp - data.price) / data.mrp) * 100)
    }

    const product = await Product.create(data)

    return NextResponse.json({ success: true, product }, { status: 201 })
  } catch (error: any) {
    console.error('Product POST error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
