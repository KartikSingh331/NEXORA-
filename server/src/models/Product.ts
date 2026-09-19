import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  image: string;
  description: string;
  category: string;
  price: number;
  countInStock: number;
  rating: number;
  numReviews: number;
  isFeatured?: boolean;
}

const productSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 4.5 },
    numReviews: { type: Number, required: true, default: 10 },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>('Product', productSchema);
