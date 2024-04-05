import api from "@/lib/axios";
import { TableSellerType } from "./tableType";

export async function getData(): Promise<TableSellerType[]> {
  // Fetch data from your API here.
  try {
    const res = await api.get("/admin/sellers");
    return res.data;
  } catch (error) {
    throw error;
  }
}
