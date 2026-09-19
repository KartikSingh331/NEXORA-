import express, { Request, Response } from 'express';
import Product from '../models/Product';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

// @route   GET /api/products
// @desc    Fetch all products with filtering & search
router.get('/', async (req: Request, res: Response) => {
  try {
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword as string,
            $options: 'i',
          },
        }
      : {};

    const category = req.query.category && req.query.category !== 'All'
      ? { category: req.query.category as string }
      : {};

    const sortOption = req.query.sort as string;
    let sortQuery: any = { createdAt: -1 };

    if (sortOption === 'price-low') {
      sortQuery = { price: 1 };
    } else if (sortOption === 'price-high') {
      sortQuery = { price: -1 };
    } else if (sortOption === 'rating') {
      sortQuery = { rating: -1 };
    }

    const products = await Product.find({ ...keyword, ...category }).sort(sortQuery);
    return res.json(products);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
});

// @route   GET /api/products/:id
// @desc    Fetch single product by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      return res.json(product);
    } else {
      return res.status(404).json({ message: 'Product not found' });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
});

// @route   POST /api/products
// @desc    Create a new product (Admin only)
router.post('/', protect, admin, async (req: Request, res: Response) => {
  try {
    const { name, price, description, image, category, countInStock, isFeatured } = req.body;

    const product = new Product({
      name: name || 'Sample Product',
      price: price || 99.99,
      description: description || 'Sample Product Description',
      image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      category: category || 'Electronics',
      countInStock: countInStock !== undefined ? countInStock : 10,
      rating: 4.5,
      numReviews: 12,
      isFeatured: Boolean(isFeatured),
    });

    const createdProduct = await product.save();
    return res.status(201).json(createdProduct);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product (Admin only)
router.put('/:id', protect, admin, async (req: Request, res: Response) => {
  try {
    const { name, price, description, image, category, countInStock, isFeatured } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name ?? product.name;
      product.price = price ?? product.price;
      product.description = description ?? product.description;
      product.image = image ?? product.image;
      product.category = category ?? product.category;
      product.countInStock = countInStock ?? product.countInStock;
      if (isFeatured !== undefined) product.isFeatured = isFeatured;

      const updatedProduct = await product.save();
      return res.json(updatedProduct);
    } else {
      return res.status(404).json({ message: 'Product not found' });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product (Admin only)
router.delete('/:id', protect, admin, async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      return res.json({ message: 'Product removed successfully' });
    } else {
      return res.status(404).json({ message: 'Product not found' });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
});

export default router;
