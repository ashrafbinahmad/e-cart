import { ProductCategory } from "@/entities/product-category.entity";
import api from "./axios";
import { Brand } from "@/entities/brand.entity";
import { Customer } from "@/entities/customer.entity";

export const getCustomers = async (): Promise<Customer[]> => {
  try {
    const res = await api.get("/seller/customers");
    return res.data;
  } catch (error) {
    throw error;
  }
};

