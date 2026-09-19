import express, { Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import { protect, admin, AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order
router.post('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid,
      paymentResult,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    // Generate unique Invoice Number (e.g., INV-2026-98421)
    const invoiceNumber = `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    // Estimated delivery in 4 days
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 4);

    const isAlreadyPaid = Boolean(isPaid);
    const paidTimestamp = isAlreadyPaid ? new Date() : undefined;
    const initialStatus = isAlreadyPaid ? 'Paid' : 'Pending';

    const order = new Order({
      orderItems,
      user: req.user!._id,
      invoiceNumber,
      shippingAddress,
      paymentMethod: paymentMethod || 'Razorpay',
      paymentResult: paymentResult || undefined,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: isAlreadyPaid,
      paidAt: paidTimestamp,
      paymentConfirmedByAdmin: isAlreadyPaid,
      estimatedDeliveryDate,
      status: initialStatus,
    });

    const createdOrder = await order.save();

    // Reduce stock for ordered items
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.countInStock = Math.max(0, product.countInStock - item.qty);
        await product.save();
      }
    }

    return res.status(201).json(createdOrder);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
});

// @route   GET /api/orders/myorders
// @desc    Get logged in user orders
router.get('/myorders', protect, async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user!._id }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
router.get('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is owner or admin
    if (order.user._id.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    return res.json(order);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
});

// @route   PUT /api/orders/:id/pay
// @desc    Update order to paid (Payment completion by User / Gateway)
router.put('/:id/pay', protect, async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = new Date();
      order.status = 'Paid';
      order.paymentResult = {
        id: req.body.id || `PAY-${Date.now()}`,
        status: req.body.status || 'COMPLETED',
        update_time: req.body.update_time || new Date().toISOString(),
        email_address: req.body.email_address || req.user!.email,
      };

      const updatedOrder = await order.save();
      return res.json(updatedOrder);
    } else {
      return res.status(404).json({ message: 'Order not found' });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
});

// @route   GET /api/orders
// @desc    Get all orders (Admin only)
router.get('/', protect, admin, async (_req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
});

// @route   PUT /api/orders/:id/deliver
// @desc    Update order to delivered / Admin approves delivery
router.put('/:id/deliver', protect, admin, async (_req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(_req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = new Date();
      order.status = 'Delivered';

      const updatedOrder = await order.save();
      return res.json(updatedOrder);
    } else {
      return res.status(404).json({ message: 'Order not found' });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
});

// @route   PUT /api/orders/:id/confirm-payment
// @desc    Admin manually confirms payment
router.put('/:id/confirm-payment', protect, admin, async (_req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(_req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = order.paidAt || new Date();
      order.paymentConfirmedByAdmin = true;
      if (order.status === 'Pending') {
        order.status = 'Paid';
      }

      const updatedOrder = await order.save();
      return res.json(updatedOrder);
    } else {
      return res.status(404).json({ message: 'Order not found' });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
});

export default router;
