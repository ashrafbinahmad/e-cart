import api from "@/lib/axios";
import { TableProductType } from "./tableType";

export async function getData(): Promise<TableProductType[]> {
  // Fetch data from your API here.
  try {
    const res = await api.get("/public/products");
    return res.data;
  } catch (error) {
    throw error;
  }
}
