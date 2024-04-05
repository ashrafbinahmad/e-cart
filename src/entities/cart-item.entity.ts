import { Customer } from "./customer.entity";
import { Product } from "./product.entity";

export class CartItem {
  id: number;
  customerId: number;
  customer: Customer;
  productId: number;
  product: Product;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  status: string;
}
