export interface Product {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  imageUrl: string;
  priceUSD: number;
  taxRate: number;
  stockQuantity: number;
  stockCode: string;
  printDurationMinutes: number;
  weightGrams: number;
  filamentCode: string;
  createdAt: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerInfo {
  fullName: string;
  address: string;
  companyName: string;
  phone: string;
  email: string;
  taxOrIdNumber: string;
  companyTitle: string;
  taxOffice: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  customerInfo: CustomerInfo;
  totalAmount: number;
  status: 'preparing' | 'ready' | 'shipped' | 'delivered';
  createdAt: Date;
}