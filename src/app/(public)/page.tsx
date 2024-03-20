// "use client";
import axios from "axios";
import { ProductCategory } from "../../entities/product-category.entity";

import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Product } from "@/entities/product.entity";
import Image from "next/image";

export async function getProductCategories(): Promise<ProductCategory[]> {
  try {
    const res = await axios.get(
      "http://localhost:3000/public/product-categories"
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getTwentyProducts(): Promise<Product[]> {
  try {
    const res = await axios.get("http://localhost:3000/public/products");
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export default function page() {
  return (
    <div>
      <ProductCategories />
      <LatestTwentyProducts />
    </div>
  );
}

// ProductCategory
export const ProductCategories = async () => {
  const productCategories: ProductCategory[] = await getProductCategories();
  return (
    <div className="bg-slate-100 m-5 min-h-44">
      <div className="container  items-center justify-center p-5">
        <div className="grid grid-rows-1 grid-cols-auto grid-flow-col gap-4 justify-center">
          {productCategories.map((category: ProductCategory, index) => {
            return (
              <Link href={`categories/${category.name}`} key={index}>
                {" "}
                <Card
                  className="min-h-40 min-w-44 bg-cover flex items-end overflow-hidden hover:shadow-sm hover:scale-105 transition-all"
                  style={{ backgroundImage: `url(${category.icon_url})` }}
                >
                  <p className="bg-slate-800 w-full text-center text-white">
                    {category.name}
                  </p>
                </Card>{" "}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const LatestTwentyProducts = async () => {
  const twentyProducts: Product[] = await getTwentyProducts();
  return (
    <section>
      <div className="container grid grid-cols-5 grid-rows-4 grid-flow-row">
        {twentyProducts.map((product, index) => {
          return (
            <div key={index} className="w-64 h-64">
              <Image
                alt={product.name}
                src={product.thumb_image_url}
                width={100}
                height={100}
              ></Image>
              <p>{product.name}</p>{" "}
            </div>
          );
        })}
      </div>
    </section>
  );
};
