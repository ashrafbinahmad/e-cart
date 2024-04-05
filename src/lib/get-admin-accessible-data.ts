import { ProductCategory } from "@/entities/product-category.entity";
import api from "./axios";
import { Brand } from "@/entities/brand.entity";
import { Customer } from "@/entities/customer.entity";
import { Seller } from "@/entities/seller.entity";
import { Product } from "@/entities/product.entity";

export const getCustomers = async (): Promise<Customer[]> => {
  try {
    const res = await api.get("/admin/customers");
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getSellers = async (): Promise<Seller[]> => {
  try {
    const res = await api.get("/admin/sellers");
    return res.data;
  } catch (error) {
    throw error;
  }
};


