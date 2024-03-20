export class Order {
  id: number;
  customerId: number;
  productId: number;
  quantity: number;
  address: string;
  status: string;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}
