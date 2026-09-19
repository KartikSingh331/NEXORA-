import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { MongoMemoryServer } from 'mongodb-memory-server';

import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import seedRoutes from './routes/seedRoutes';
import User from './models/User';
import Product from './models/Product';
import Order from './models/Order';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/seed', seedRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'E-Commerce Backend API is active' });
});

// Production: Serve React frontend static files from single Express server
if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDistPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Auto-seed function if DB is empty
const autoSeed = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Database empty. Triggering automatic database seeding...');

      const adminUser = await User.create({
        name: 'Kartik Sharma',
        email: 'admin@ecommerce.com',
        password: 'admin123',
        role: 'admin',
      });

      const regularUser = await User.create({
        name: 'Rahul Verma',
        email: 'user@ecommerce.com',
        password: 'user123',
        role: 'user',
      });

      const seedProducts = [
        {
          name: 'AuraSound Pro Wireless Headphones',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
          description: 'Active noise-canceling over-ear headphones with 40-hour battery life, high-fidelity drivers, and sleek memory foam earcups.',
          category: 'Audio',
          price: 199.99,
          countInStock: 25,
          rating: 4.8,
          numReviews: 42,
          isFeatured: true,
        },
        {
          name: 'Chronos Smart Watch Ultra',
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
          description: 'Premium titanium smart watch with sapphire crystal glass, heart-rate & SpO2 monitoring, standalone GPS, and 7-day battery power.',
          category: 'Wearables',
          price: 299.99,
          countInStock: 15,
          rating: 4.9,
          numReviews: 38,
          isFeatured: true,
        },
        {
          name: 'Lumina 4K Ultra HD Action Camera',
          image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
          description: 'Waterproof 4K/60fps action camera with 6-axis gyro stabilization, dual screens, and voice command controls.',
          category: 'Electronics',
          price: 249.50,
          countInStock: 18,
          rating: 4.6,
          numReviews: 29,
          isFeatured: true,
        },
        {
          name: 'VoltCharge Magnetic Wireless Power Bank 10000mAh',
          image: 'https://images.unsplash.com/photo-1609592424074-124b6118029c?w=800&auto=format&fit=crop&q=80',
          description: 'Compact 15W MagSafe compatible wireless power bank with USB-C fast charging port and LED digital battery display.',
          category: 'Accessories',
          price: 49.99,
          countInStock: 50,
          rating: 4.7,
          numReviews: 64,
          isFeatured: false,
        },
        {
          name: 'AeroType Mechanical RGB Keyboard',
          image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
          description: 'Hot-swappable tactile switches, per-key RGB backlighting, aircraft-grade aluminum top plate, and detachable USB-C cable.',
          category: 'Gaming',
          price: 129.99,
          countInStock: 30,
          rating: 4.8,
          numReviews: 53,
          isFeatured: true,
        },
        {
          name: 'Zenith Minimalist Leather Backpack',
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
          description: 'Full-grain waterproof Italian leather laptop backpack with padded 16-inch laptop sleeve and hidden anti-theft pocket.',
          category: 'Fashion',
          price: 159.00,
          countInStock: 12,
          rating: 4.9,
          numReviews: 19,
          isFeatured: false,
        },
        {
          name: 'Pulse360 Portable Bluetooth Speaker',
          image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80',
          description: 'IPX7 waterproof wireless speaker delivering 360-degree immersive bass, 24-hour continuous playtime, and party sync tech.',
          category: 'Audio',
          price: 89.99,
          countInStock: 40,
          rating: 4.5,
          numReviews: 31,
          isFeatured: false,
        },
        {
          name: 'Precision Master Ergonomic Wireless Mouse',
          image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
          description: 'Ergonomic vertical wireless mouse with hyper-fast scroll wheel, multi-device Bluetooth switching, and quiet click switches.',
          category: 'Accessories',
          price: 69.99,
          countInStock: 22,
          rating: 4.7,
          numReviews: 45,
          isFeatured: false,
        },
      ];

      const createdProds = await Product.insertMany(seedProducts);
      const invoiceNumber = `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const estimatedDeliveryDate = new Date();
      estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 4);

      await Order.create({
        user: regularUser._id,
        invoiceNumber,
        orderItems: [
          {
            product: createdProds[0]._id,
            name: createdProds[0].name,
            qty: 1,
            image: createdProds[0].image,
            price: createdProds[0].price,
          },
        ],
        shippingAddress: {
          address: '742 Evergreen Terrace',
          city: 'Springfield',
          postalCode: '97477',
          country: 'United States',
        },
        paymentMethod: 'Razorpay',
        itemsPrice: createdProds[0].price,
        taxPrice: 16.0,
        shippingPrice: 0.0,
        totalPrice: createdProds[0].price + 16.0,
        isPaid: true,
        paidAt: new Date(),
        paymentConfirmedByAdmin: true,
        isDelivered: false,
        estimatedDeliveryDate,
        status: 'Paid',
      });

      console.log('Database auto-seeded successfully!');
    }
  } catch (err) {
    console.error('Auto-seed error:', err);
  }
};

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce';
  try {
    console.log(`Connecting to MongoDB at ${uri}...`);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.log('MongoDB connected successfully!');
    await autoSeed();
  } catch (err) {
    console.warn('Local MongoDB connection failed. Starting fallback In-Memory MongoDB Server...');
    try {
      const mongod = await MongoMemoryServer.create();
      const inMemoryUri = mongod.getUri();
      await mongoose.connect(inMemoryUri);
      console.log('Connected to In-Memory MongoDB Server successfully!');
      await autoSeed();
    } catch (memErr) {
      console.error('In-Memory MongoDB start error:', memErr);
    }
  }
};

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`E-Commerce Server running on http://localhost:${PORT}`);
  });
});
