export class Review {
  id: number;
  customerId: number;
  productId: number;
  comment?: string;
  stars?: number;
  createdAt: Date;
  updatedAt: Date;
}
