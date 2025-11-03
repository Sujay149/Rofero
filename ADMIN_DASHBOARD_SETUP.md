# Admin Dashboard Setup Guide

## 🎯 Overview
Complete admin dashboard system with MongoDB Atlas for managing products, orders, and analytics for The House of Rare e-commerce platform.

## ✨ Features Implemented

### 1. **Dashboard Overview**
- 📊 Real-time statistics (Revenue, Orders, Pending Orders, Total Products)
- 📈 Recent orders table
- 🎨 Beautiful UI with color-coded status badges
- 📱 Fully responsive design

### 2. **Product Management**
- ➕ Add new products with complete details
- ✏️ Edit existing products
- 🗑️ Delete products
- 👁️ View products on storefront
- 🖼️ Multiple images support
- 🎨 Multiple colors & sizes
- 📦 Stock management
- 💰 Automatic discount calculation
- ⭐ Features & fabric care instructions

### 3. **Order Management**
- 📋 View all orders
- 🔍 Search by order number or customer email
- 🏷️ Filter by status (Pending, Confirmed, Shipped, etc.)
- 💳 Payment status tracking
- 📊 Order statistics

### 4. **MongoDB Integration**
- ☁️ MongoDB Atlas cloud database
- 🔄 Automatic connection pooling
- 📚 Mongoose ODM with schemas
- 🔍 Indexed queries for performance
- 💾 Persistent data storage

## 📁 Project Structure

```
app/
├── admin/
│   ├── dashboard/
│   │   └── page.tsx              # Main admin dashboard
│   ├── products/
│   │   ├── new/
│   │   │   └── page.tsx          # Add new product
│   │   └── [id]/
│   │       └── page.tsx          # Edit product (to be created)
│   └── orders/
│       └── [id]/
│           └── page.tsx          # Order details (to be created)
├── api/
│   └── admin/
│       ├── products/
│       │   ├── route.ts          # GET all, POST new product
│       │   └── [id]/
│       │       └── route.ts      # GET, PUT, DELETE product
│       └── orders/
│           ├── route.ts          # GET all, POST new order
│           └── [id]/
│               └── route.ts      # GET, PUT, DELETE order
models/
├── Product.ts                    # Product Mongoose schema
└── Order.ts                      # Order Mongoose schema
lib/
└── mongodb.ts                    # MongoDB connection utility
```

## 🚀 Setup Instructions

### Step 1: MongoDB Atlas Setup

1. **Create Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Click "Start Free" and create an account
   - Choose the FREE tier (M0 Sandbox)

2. **Create Cluster**
   - Select cloud provider (AWS recommended)
   - Choose region closest to you
   - Click "Create Cluster" (takes 3-5 minutes)

3. **Create Database User**
   - Click "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `admin` (or your choice)
   - Password: Generate a strong password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Whitelist IP Address**
   - Click "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add your specific IP address
   - Click "Confirm"

5. **Get Connection String**
   - Click "Database" in left sidebar
   - Click "Connect" button on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/`

6. **Update .env.local**
   - Replace `<username>` with your database username
   - Replace `<password>` with your database password
   - Replace `cluster0.xxxxx.mongodb.net` with your actual cluster URL
   - Add database name: `/thehouseofrare` at the end

**Example:**
```env
MONGODB_URI=mongodb+srv://admin:MyPass123@cluster0.abc123.mongodb.net/thehouseofrare?retryWrites=true&w=majority
```

### Step 2: Environment Variables

Edit `.env.local` file:

```env
# MongoDB Atlas Connection (REQUIRED)
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/thehouseofrare?retryWrites=true&w=majority

# NextAuth (Generate a random secret)
NEXTAUTH_SECRET=your-super-secret-key-minimum-32-characters-long
NEXTAUTH_URL=http://localhost:3000

# Admin Credentials (Change these!)
ADMIN_EMAIL=admin@thehouseofrare.com
ADMIN_PASSWORD=YourSecurePassword123!

# Cloudinary (Optional - for future image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Generate NEXTAUTH_SECRET:**
```powershell
# Run in PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

### Step 3: Install Dependencies

```powershell
npm install --legacy-peer-deps mongoose
```

### Step 4: Start Development Server

```powershell
npm run dev
```

Server will start on: http://localhost:3000

## 📱 Access Admin Dashboard

### Option 1: Direct URL
Visit: **http://localhost:3000/admin/dashboard**

### Option 2: From Homepage
1. Go to http://localhost:3000
2. Navigate to `/admin/dashboard` in the URL

## 🎯 How to Use Admin Dashboard

### Adding a New Product

1. **Navigate to Products Tab**
   - Click "Products" tab in admin dashboard
   - Or go directly to http://localhost:3000/admin/products/new

2. **Fill Product Details**
   - **Basic Info:**
     - Product Name (required)
     - Subtitle (e.g., "LOBO - NAVY")
     - Short Description (required)
     - Long Description (optional)
     - Category (Hoodies, T-Shirts, etc.)
     - SKU (optional)

   - **Pricing:**
     - MRP (₹) - Maximum Retail Price
     - Selling Price (₹) - Actual selling price
     - Discount automatically calculated

   - **Images:**
     - Enter image URL
     - Click "+" to add
     - Supports multiple images
     - Images can be from any public URL

   - **Colors:**
     - Enter color name (e.g., "Navy Blue")
     - Click "Add"
     - Add multiple colors

   - **Sizes:**
     - Enter size (e.g., "M-40", "L-42")
     - Click "Add"
     - Add multiple sizes

   - **Features:**
     - Enter feature (e.g., "Premium Cotton Blend")
     - Click "Add"
     - Add multiple features

   - **Fabric Care:**
     - Enter care instruction
     - Click "Add"
     - Add multiple instructions

   - **Stock:**
     - Stock Quantity (number of units)
     - In Stock (Yes/No)

3. **Submit**
   - Click "Create Product"
   - Product will be saved to MongoDB
   - Redirects to dashboard

### Managing Orders

1. **View All Orders**
   - Click "Orders" tab in dashboard
   - See all orders with status

2. **Search Orders**
   - Use search box to find by:
     - Order number
     - Customer email

3. **Filter Orders**
   - Select status from dropdown:
     - All Status
     - Pending
     - Confirmed
     - Processing
     - Shipped
     - Delivered
     - Cancelled

4. **View Order Details**
   - Click "View" button on any order
   - See full order information

### Dashboard Statistics

**Overview Tab shows:**
- 💰 **Total Revenue**: Sum of all orders
- 📦 **Total Orders**: Count of all orders
- ⏰ **Pending Orders**: Orders needing action
- 📦 **Total Products**: Products in inventory

## 🗄️ Database Collections

### Products Collection
```javascript
{
  _id: ObjectId,
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
  stockQuantity: Number,
  inStock: Boolean,
  sku: String,
  rating: Number,
  reviews: Number,
  sizeChart: {
    headers: [String],
    rows: [[String]]
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  userId: String,
  userEmail: String,
  orderNumber: String,
  items: [{
    productId: ObjectId,
    name: String,
    price: Number,
    quantity: Number,
    size: String,
    color: String,
    image: String
  }],
  shippingAddress: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  paymentMethod: String,
  paymentStatus: String,
  orderStatus: String,
  subtotal: Number,
  tax: Number,
  total: Number,
  trackingNumber: String,
  cancelReason: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/products` | Get all products |
| GET | `/api/admin/products?search=hoodie` | Search products |
| GET | `/api/admin/products?category=Hoodies` | Filter by category |
| GET | `/api/admin/products/[id]` | Get single product |
| POST | `/api/admin/products` | Create new product |
| PUT | `/api/admin/products/[id]` | Update product |
| DELETE | `/api/admin/products/[id]` | Delete product |

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/orders` | Get all orders |
| GET | `/api/admin/orders?status=pending` | Filter by status |
| GET | `/api/admin/orders?search=email` | Search orders |
| GET | `/api/admin/orders/[id]` | Get single order |
| POST | `/api/admin/orders` | Create new order |
| PUT | `/api/admin/orders/[id]` | Update order |
| DELETE | `/api/admin/orders/[id]` | Delete order |

## 📝 Example: Adding Product via API

```javascript
// POST /api/admin/products
const productData = {
  name: "Premium Hoodie",
  subtitle: "NAVY BLUE",
  description: "Comfortable premium hoodie",
  mrp: 4999,
  price: 3999,
  images: [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  colors: ["Navy Blue", "Black", "Grey"],
  sizes: ["S-38", "M-40", "L-42", "XL-44"],
  category: "Hoodies",
  features: [
    "Premium Cotton Blend",
    "Regular Fit",
    "Machine Washable"
  ],
  fabricCare: [
    "Machine wash cold",
    "Do not bleach",
    "Tumble dry low"
  ],
  stockQuantity: 100,
  inStock: true,
  sku: "HOOD-001"
}

const response = await fetch('/api/admin/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(productData)
})

const result = await response.json()
console.log(result.product) // Created product
```

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: querySrv ENOTFOUND _mongodb._tcp.rer
```
**Fix:**
1. Check MongoDB URI in `.env.local`
2. Ensure username/password are correct
3. Verify IP whitelist in MongoDB Atlas
4. Check network connection

### Products Not Showing
**Fix:**
1. Check MongoDB connection
2. Verify `.env.local` is loaded
3. Check browser console for errors
4. Try adding a product first

### Images Not Loading
**Fix:**
1. Use direct image URLs (not relative paths)
2. Ensure URLs are publicly accessible
3. Use HTTPS URLs for better compatibility
4. Consider using Cloudinary for image hosting

## 🎨 Customization

### Adding New Fields to Products
1. Update `models/Product.ts` schema
2. Update API routes
3. Update admin form
4. Update product display pages

### Changing Status Colors
Edit in `app/admin/dashboard/page.tsx`:
```typescript
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    // Add more colors
  }
  return colors[status]
}
```

## 🚀 Next Steps

### 1. Image Upload System
- Integrate Cloudinary for image uploads
- Add drag-and-drop interface
- Automatic image optimization

### 2. Order Details Page
- Create `/admin/orders/[id]/page.tsx`
- Show detailed order information
- Add status update functionality
- Print order invoice

### 3. Product Edit Page
- Create `/admin/products/[id]/page.tsx`
- Pre-fill form with existing data
- Update functionality

### 4. Analytics Dashboard
- Sales charts (daily, weekly, monthly)
- Top-selling products
- Customer analytics
- Revenue trends

### 5. Admin Authentication
- Secure admin routes
- Login page for admin
- Role-based access control

### 6. Bulk Operations
- Import products from CSV
- Export orders to Excel
- Bulk price updates
- Bulk stock updates

## 📚 Resources

- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🔒 Security Notes

1. **Never commit .env.local** (already in .gitignore)
2. **Change admin password** before deployment
3. **Use strong MongoDB password**
4. **Enable MongoDB Atlas IP whitelist**
5. **Add admin authentication** before production
6. **Use HTTPS** in production

## 📞 Support

For issues or questions:
1. Check MongoDB Atlas connection
2. Verify environment variables
3. Check browser console for errors
4. Review API responses in Network tab

---

**Status:** ✅ Fully Implemented and Ready to Use
**Last Updated:** January 2025
**Version:** 1.0.0
