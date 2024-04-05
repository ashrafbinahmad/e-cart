import { Brand } from "@/entities/brand.entity";
import { ProductCategory } from "@/entities/product-category.entity";
import { Product } from "@/entities/product.entity";

export class TableProductType extends Product {
  brand: Brand;
  product_category: ProductCategory;
}
