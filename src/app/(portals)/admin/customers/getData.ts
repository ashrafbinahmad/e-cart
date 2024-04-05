import api from "@/lib/axios";
import { Customer } from "@/entities/customer.entity";

export async function getData(): Promise<Customer[]> {
  // Fetch data from your API here.
  try {
    const res = await api.get("/admin/customers");
    return res.data;
  } catch (error) {
    throw error;
  }
}
