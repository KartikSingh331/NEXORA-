import express, { Request, Response } from 'express';
import User from '../models/User';
import Product from '../models/Product';
import Order from '../models/Order';

const router = express.Router();

const initialProducts = [
  {
    name: 'AuraSound Pro Wireless Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    description: 'Active noise-canceling over-ear headphones with 40-hour battery life, high-fidelity drivers, and sleek ergonomic memory foam earcups.',
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

router.post('/', async (_req: Request, res: Response) => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    // Create Admin and Customer accounts
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

    // Seed products
    const createdProducts = await Product.insertMany(initialProducts);

    // Create a sample seed order
    const invoiceNumber = `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 4);

    const sampleOrder = await Order.create({
      user: regularUser._id,
      invoiceNumber,
      orderItems: [
        {
          product: createdProducts[0]._id,
          name: createdProducts[0].name,
          qty: 1,
          image: createdProducts[0].image,
          price: createdProducts[0].price,
        },
      ],
      shippingAddress: {
        address: '123 Tech Park Way',
        city: 'San Francisco',
        postalCode: '94107',
        country: 'United States',
      },
      paymentMethod: 'Razorpay',
      itemsPrice: createdProducts[0].price,
      taxPrice: 16.0,
      shippingPrice: 0.0,
      totalPrice: createdProducts[0].price + 16.0,
      isPaid: true,
      paidAt: new Date(),
      paymentConfirmedByAdmin: true,
      isDelivered: false,
      estimatedDeliveryDate,
      status: 'Paid',
    });

    return res.status(201).json({
      message: 'Database seeded successfully',
      users: {
        admin: { name: adminUser.name, email: adminUser.email },
        user: { name: regularUser.name, email: regularUser.email },
      },
      productsCount: createdProducts.length,
      sampleOrder: sampleOrder._id,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Seeding failed' });
  }
});

export default router;
