import api from "@/lib/axios";
import { TableOrderType } from "./tableType";

export async function getData(): Promise<TableOrderType[]> {
  // Fetch data from your API here.
  try {
    const res = await api.get("/admin/orders");
    return res.data;
  } catch (error) {
    throw error;
  }
}
