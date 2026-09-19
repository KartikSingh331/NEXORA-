export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  token?: string;
}

export interface Product {
  _id: string;
  name: string;
  image: string;
  description: string;
  category: string;
  price: number;
  countInStock: number;
  rating: number;
  numReviews: number;
  isFeatured?: boolean;
  createdAt?: string;
}

export interface CartItem {
  _id: string;
  product: string;
  name: string;
  image: string;
  price: number;
  countInStock: number;
  qty: number;
}

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  product: string;
  name: string;
  qty: number;
  image: string;
  price: number;
}

export interface Order {
  _id: string;
  invoiceNumber?: string;
  user: User | string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentResult?: {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
  };
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  paymentConfirmedByAdmin: boolean;
  isDelivered: boolean;
  deliveredAt?: string;
  estimatedDeliveryDate?: string;
  status: 'Pending' | 'Paid' | 'Processing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  createdAt: string;
}
