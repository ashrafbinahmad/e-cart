import { Customer } from "./customer.entity";
import { Product } from "./product.entity";

export class Order {
  id: number;
  customerId: number;
  customer: Customer;
  productId: number;
  product: Product;
  quantity: number;
  address: string;
  status: string;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}
