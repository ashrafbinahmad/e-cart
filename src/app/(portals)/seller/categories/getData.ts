import api from "@/lib/axios";
import { TableProductCategoryType } from "./tableType";

export async function getData(): Promise<TableProductCategoryType[]> {
  // Fetch data from your API here.
  try {
    const res = await api.get("/public/product-categories");
    return res.data;
  } catch (error) {
    throw error;
  }
}
