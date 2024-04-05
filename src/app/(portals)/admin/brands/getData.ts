import api from "@/lib/axios";
import { TableBrandType } from "./tableType";

export async function getData(): Promise<TableBrandType[]> {
  // Fetch data from your API here.
  try {
    const res = await api.get("/public/brands");
    return res.data;
  } catch (error) {
    throw error;
  }
}
