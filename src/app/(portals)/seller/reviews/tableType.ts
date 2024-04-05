import { Brand } from "@/entities/brand.entity";
import { Customer } from "@/entities/customer.entity";
import { Order } from "@/entities/order.entity";
import { ProductCategory } from "@/entities/product-category.entity";
import { Product } from "@/entities/product.entity";
import { Review } from "@/entities/review.entity";

export class TableReviewType extends Review {
    customer: Customer;
    product: Product;
}
