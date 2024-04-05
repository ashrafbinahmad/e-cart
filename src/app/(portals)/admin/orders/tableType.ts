import { Customer } from "@/entities/customer.entity";
import { Order } from "@/entities/order.entity";
import { Product } from "@/entities/product.entity";

export class TableOrderType extends Order {
    customer: Customer;
    product: Product;
}
