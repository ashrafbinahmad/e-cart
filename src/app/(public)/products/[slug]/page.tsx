import { Button } from "@/components/ui/button";
import { Product } from "@/entities/product.entity";
import api from "@/lib/axios";
import { getImageFullUrl } from "@/lib/helpers";
import axios from "axios";
import { IndianRupeeIcon } from "lucide-react";
import Image from "next/image";
import React, { ReactNode } from "react";
import BtnAddtocart from "../../btnAddtocart";

async function getProduct(id: string | number): Promise<Product | undefined> {
  try {
    const res = await axios.get(
      `${process.env.API_HOST}/public/products/${id}`
    );
    return res.data;
  } catch (error) {
  }
}

export default async function Page({
  params,
  searchParams: { id },
}: {
  params: { slug: string };
  searchParams: { id: string };
}) {
  const product = await getProduct(id);
  const productImages = [
    product?.thumb_image_url,
    product?.image_1_url,
    product?.image_2_url,
    product?.image_3_url,
  ];
  return (
    <div className="grid grid-cols-2 mt-5 gap-5 container">
      <div className="IMAGES_COL h-screen">
        <div className="grid grid-cols-[1fr_5fr]">
          <div className="IMAGE_NAV grid items-center  m-auto">
            {productImages.map((productImage, index) =>
              productImage ? (
                <Image
                  key={index}
                  src={`${process.env.API_HOST}/${productImage}`}
                  alt={product?.name || ""}
                  width={60}
                  height={60}
                  className="border p-2 rounded"
                />
              ) : (
                <></>
              )
            )}
          </div>
          <div className="grid h-full justify-center">
            <Image
              src={`${process.env.API_HOST}/${product?.thumb_image_url}`}
              alt={product?.name || ""}
              width={800}
              height={800}
              className="border p-8 rounded"
            />
          </div>
        </div>
      </div>
      <div className="DESCRIPTIONS_COL flex flex-col gap-2">
        <p className="text-2xl">{product?.name}</p>
        <p className="text-xl text-gray-400">
          Sold by {product?.seller?.company_name}
        </p>
        <hr />
        {product?.color && (
          <span
            className="w-5 h-5 rounded-full"
            style={{ background: product?.color }}
          ></span>
        )}
        <div className="BRAND flex items-center gap-3 ">
          <Image
            alt={product?.brand?.name || ""}
            src={getImageFullUrl(product?.brand?.logo_url)}
            width={30}
            height={30}
          />{" "}
          {product?.brand?.name}
        </div>
        <p>Only {product?.stock} items left.</p>
        <p className=" my-2 mt-10 font-bold text-3xl flex items-baseline">
          {" "}
          <IndianRupeeIcon className="h-[13px]" /> {product?.price_rupee.toLocaleString("en-IN")}
        </p>
        <div className="BUTTONS grid grid-cols-2 gap-2">
          <Button variant={"default"}>Buy</Button>
          <BtnAddtocart productId={product?.id || ""}  quantity={1} />
        </div>
        <div className="ALL_PROPERTIES grid">
          {product &&
            Object.keys(product).map((key, index) => {
              const exclusions: Array<keyof Product | "_count"> = [
                "brandId",
                "createdAt",
                "id",
                "name",
                "product_categoryId",
                "sellerId",
                "updatedAt",
                "thumb_image_url",
                "image_1_url",
                "image_2_url",
                "image_3_url",
                "_count",
              ];
              if (exclusions.includes(key as keyof Product)) return;
              return (
                <div key={index} className="grid grid-cols-2">
                  <p className="capitalize">{key.replaceAll("_", " ")}</p>
                  <div>
                    {product[key as keyof Product]?.toString()}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
