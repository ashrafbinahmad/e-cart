// import { Brand } from 'src/brands/entities/brand.entity';
// import { CartItem } from 'src/cart-items/entities/cart-item.entity';
// import { Order } from 'src/orders/entities/order.entity';
// import { ProductCategory } from 'src/product-categories/entities/product-category.entity';
// import { Review } from 'src/reviews/entities/review.entity';
// import { Seller } from 'src/sellers/entities/seller.entity';

export class Product {
  id: number;
  name: string;
  color?: string;
  material?: string;
  weight_grams?: number;
  price_rupee: number;
  offer_price_rupee?: number;
  thumb_image_url: string;
  image_1_url?: string;
  image_2_url?: string;
  image_3_url?: string;
  // brand: Brand;
  brandId: number;
  // product_category: ProductCategory;
  product_categoryId: number;
  // reviews: Review[];
  // cart_items: CartItem[];
  // orders: Order[];
  createdAt: Date;
  updatedAt: Date;
  stock: number;
  // Seller: Seller;
  sellerId: number;
}
