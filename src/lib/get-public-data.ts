import { ProductCategory } from "@/entities/product-category.entity";
import api from "./axios";
import { Brand } from "@/entities/brand.entity";
import { Product } from "@/entities/product.entity";

export const getCategories = async (): Promise<ProductCategory[]> => {
  try {
    const res = await api.get("/public/product-categories");
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getBrands = async (): Promise<Brand[]> => {
  try {
    const res = await api.get("/public/brands");
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getProducts = async (): Promise<Product[]> => {
  try {
    const res = await api.get("/public/products");
    return res.data;
  } catch (error) {
    throw error;
  }
};
