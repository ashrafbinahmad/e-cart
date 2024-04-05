import api from "@/lib/axios";
import { TableCartItemType } from "./tableType";

export async function getData(): Promise<TableCartItemType[]> {
  // Fetch data from your API here.
  try {
    const res = await api.get("/admin/cart-items");
    return res.data;
  } catch (error) {
    throw error;
  }
}
