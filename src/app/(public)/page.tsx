// "use client";
import axios from "axios";
import { ProductCategory } from "../../entities/product-category.entity";

import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Product } from "@/entities/product.entity";
import Image from "next/image";
import { IndianRupee, IndianRupeeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCammafiedNumber, getImageFullUrl } from "@/lib/helpers";
import api from "@/lib/axios";
import ClientOnly from "@/components/customized/client-only";
import BtnAddtocart from "./btnAddtocart";

export async function getProductCategories(): Promise<ProductCategory[]> {
  try {
    const res = await axios.get(
      `${process.env.API_HOST}/public/product-categories`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getTwentyProducts(): Promise<Product[]> {
  try {
    const res = await axios.get(`${process.env.API_HOST}/public/products`);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export default function page({
  searchParams,
}: {
  searchParams: { search: string };
}) {
  return (
    <div className="grid grid-flow-col grid-cols-1 sm:grid-cols-[260px_1fr]">
      <ProductCategories />
      {searchParams?.search ? (
        <SearchResults search={searchParams?.search} />
      ) : (
        <LatestTwentyProducts />
      )}
    </div>
  );
}

// ProductCategory
export const ProductCategories = async () => {
  const productCategories: ProductCategory[] = await getProductCategories();

  return (
    <div className="hidden sm:block bg-red-100 m-5 min-h-44 max-w-[260px]">
      <div className="container p-5">
        <div className="grid gap-2">
          {productCategories.map((category: ProductCategory, index) => {
            return (
              <Link href={`?search=${category.name}`} key={index}>
                {" "}
                <Card className="min-w-44 bg grid grid-cols-[auto_1fr] items-center">
                  <Image
                    alt={category.name || ""}
                    width={60}
                    height={60}
                    src={`${process.env.API_HOST}/${category?.icon_url}`}
                    className="w-10 h-10 bg-slate-400"
                  />
                  <p className=" text-black ml-3">{category.name}</p>
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
  const addToCart = async (
    productId: number | string,
    count: number | string
  ) => {
    try {
      const res = await api.post("/customer/cart-items", {
        productId,
        count,
      });
    } catch (error) {}
  };
  const twentyProducts: Product[] = await getTwentyProducts();
  return (
    <section className="mt-5">
      <p>{}</p>
      <div className="container grid grid-cols-2 lg:grid-cols-3 grid-rows-3 grid-flow-row gap-0">
        {twentyProducts.map((product, index) => {
          return (
            <div
              key={index}
              className="border overflow-hidden p-5 flex flex-col items-start justify-between"
            >
              <Image
                alt={product.name}
                src={`${process.env.API_HOST}/${product?.thumb_image_url}`}
                width={150}
                height={150}
              ></Image>
              <div className="grid gap-2">
                <h2 className="my-2 font-bold text-xl flex items-baseline">
                  {" "}
                  <IndianRupeeIcon className="h-[13px]" />{" "}
                  {product.price_rupee.toLocaleString("en-IN")}
                </h2>
                <hr />
                <Link
                  href={`/products/${product.name.replaceAll(" ", "-")}?id=${
                    product.id
                  }`}
                >
                  <p
                    className="h-12 text-ellipsis max-w-[400px] line-clamp-2 hover:text-blue-600"
                    style={{ display: "-webkit-box" }}
                  >
                    {product.name}
                  </p>{" "}
                </Link>
                <div className="BRAND flex items-center gap-3 ">
                  <Image
                    alt={product.brand?.name || ""}
                    src={getImageFullUrl(product.brand?.logo_url)}
                    width={30}
                    height={30}
                  />{" "}
                  {product.brand?.name}
                </div>
                {product.color && (
                  <span
                    className={`w-5 h-5 rounded-full border bg-[${product.color}]`}
                  ></span>
                )}
                <p>Only {product.stock} items left.</p>
                <div className="BUTTONS mt-5 flex justify-between">
                  <BtnAddtocart productId={product.id} quantity={1} />
                  <Button variant={"default"}>Buy</Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export async function getSearchResultProducts(
  searchText: string
): Promise<Product[]> {
  try {
    const res = await axios.get(
      `${process.env.API_HOST}/public/products?search=${searchText}`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export const SearchResults = async ({ search }: { search: string }) => {
  const searchResultProducts: Product[] = await getSearchResultProducts(search);
  return (
    <section className="mt-5 container">
      <p className="my-2">Searching {search}</p>
      <div className="grid grid-cols-3 grid-rows-3 grid-flow-row gap-0">
        {searchResultProducts.map((product, index) => {
          return (
            <div
              key={index}
              className="border  overflow-hidden p-5 flex flex-col items-start justify-between"
            >
              <Image
                alt={product.name}
                src={`${process.env.API_HOST}/${product?.thumb_image_url}`}
                width={150}
                height={150}
              ></Image>
              <div className="grid gap-2">
                <h2 className="my-2 font-bold text-xl flex items-baseline">
                  {" "}
                  <IndianRupeeIcon className="h-[13px]" />{" "}
                  {product.price_rupee.toLocaleString("en-IN")}
                </h2>
                <hr />
                <Link
                  href={`/products/${product.name.replaceAll(" ", "-")}?id=${
                    product.id
                  }`}
                >
                  <p
                    className="h-12 text-ellipsis max-w-[400px] line-clamp-2 hover:text-blue-600"
                    style={{ display: "-webkit-box" }}
                  >
                    {product.name}
                  </p>{" "}
                </Link>
                <div className="BRAND flex items-center gap-3 ">
                  <Image
                    alt={product.brand?.name || ""}
                    src={getImageFullUrl(product.brand?.logo_url)}
                    width={30}
                    height={30}
                  />{" "}
                  {product.brand?.name}
                </div>
                {product.color && (
                  <span
                    className="w-5 h-5 rounded-full"
                    style={{ background: product.color }}
                  ></span>
                )}
                <p>Only {product.stock} items left.</p>
                <div className="BUTTONS mt-5 flex justify-between">
                  <BtnAddtocart productId={product.id} quantity={1} />
                  <Button variant={"default"}>Buy</Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
