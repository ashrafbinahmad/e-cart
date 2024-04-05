import api from "@/lib/axios";
import { TableReviewType } from "./tableType";

export async function getData(): Promise<TableReviewType[]> {
  // Fetch data from your API here.
  try {
    const res = await api.get("/seller/reviews");
    return res.data;
  } catch (error) {
    throw error;
  }
}
