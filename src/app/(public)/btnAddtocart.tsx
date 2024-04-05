"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import api from "@/lib/axios";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { add_to_cart } from "@/lib/store/cartSlice";
import { useRouter } from "next/navigation";
import { title } from "process";
import React from "react";

export default function BtnAddtocart({
  className,
  productId,
  quantity,
}: {
  className?: string;
  productId: string | number;
  quantity: string | number;
}) {
  const dispatch = useAppDispatch();
  const cart_items = useAppSelector((state) => {
    return state.cart.cartItems;
  });
  const cart_productIds = cart_items.map((item) => item.productId);
  const isAddedToCart = cart_productIds.includes(productId);
  const router = useRouter();
  return (
    <Button
      variant={"outline"}
      className={`${
        isAddedToCart
          ? "bg-orange-600 text-gray-50 hover:bg-orange-800 hover:text-white"
          : ""
      }`}
      onClick={async () => {
        if (!isAddedToCart)
          try {
            const res = await api.post(`/customer/cart-items`, {
              productId,
              quantity,
              customerId: "1",
            });
            if (res) {
              dispatch(add_to_cart({ productId, quantity }));
              toast({ title: "Added to cart", variant: "success" });
            }
          } catch (error) {
            toast({ title: "Can't save." });
          }
        else {
          router.push("/cart");
        }
      }}
    >
      {isAddedToCart ? "Go to my cart" : "Add to cart"}
    </Button>
  );
}
