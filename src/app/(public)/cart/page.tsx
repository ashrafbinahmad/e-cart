"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { CartItem } from "@/entities/cart-item.entity";
import { Product } from "@/entities/product.entity";
import api from "@/lib/axios";
import { getImageFullUrl } from "@/lib/helpers";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { remove_from_cart } from "@/lib/store/cartSlice";
import { AxiosError } from "axios";
import { IndianRupeeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Page() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>();
  const { register, getValues, watch, setValue } = useForm();
  const dispatch = useAppDispatch();

  useEffect(() => {
    loadCartItems();
    return () => {};
  }, []);

  async function loadCartItems() {
    try {
      const res = await api.get("/customer/cart-items");
      if (res) setCartItems(res.data);
    } catch (error) {}
  }

  useEffect(() => {
    const total = cartItems.reduce((accumulator, currentValue) => {
      return (
        accumulator + currentValue.product.price_rupee * currentValue.quantity
      );
    }, 0);
    setTotalAmount(total);
    return () => {};
  }, [cartItems]);

  function onsubmit() {
    const formValues = getValues();
    let orderCount = 0;
    cartItems.forEach(async (cartItem, index) => {
      const orderData = {
        productId: cartItem.productId,
        customerId: "1",
        quantity: formValues[`${cartItem.productId.toString()}_count`] || 1,
        address: formValues["address"],
        location: formValues["location"],
      };
      try {
        const res = await api.post("/customer/orders", orderData);
        if (res.data) {
          orderCount += 1;
          toast({
            title: `Order placed, ordered ${orderCount} products`,
            variant: "success",
          });
        }
      } catch (error) {
        if (error instanceof AxiosError)
          toast({
            title: error?.response?.data.message,
            variant: "destructive",
          });
        else throw error;
      }
    });
  }

  async function deleteFromCart(cartItemId: number) {
    try {
      const res = await api.delete(`/customer/cart-items/${cartItemId}`);
      if (res.data) {
        toast({
          title: "Removed from cart.",
        });
        loadCartItems();
        dispatch(remove_from_cart({ id: cartItemId }));
      }
    } catch (error) {}
  }

  return (
    <section className="mt-5 container">
      {cartItems ? (
        <>
          <div className="grid grid-cols-1 grid-flow-row gap-0">
            {cartItems.map((cartItem, index) => {
              return (
                <div
                  key={index}
                  className="border  overflow-hidden p-5 grid grid-rows-2 sm:grid-cols-[300px_1fr] sm:grid-rows-1 items-center justify-center"
                >
                  <Image
                    alt={cartItem.product.name}
                    src={`${process.env.API_HOST}/${cartItem?.product.thumb_image_url}`}
                    width={190}
                    height={190}
                    className="m-auto"
                  ></Image>
                  <div className="grid gap-2">
                    <h2 className="my-2 font-bold text-xl flex items-baseline">
                      {" "}
                      <IndianRupeeIcon className="h-[13px]" />{" "}
                      {cartItem.product.price_rupee.toLocaleString("en-IN")}
                    </h2>
                    <hr />
                    <Link
                      href={`/products/${cartItem?.product.name?.replaceAll(
                        " ",
                        "-"
                      )}?id=${cartItem.product.id}`}
                    >
                      <p
                        className="h-12 text-ellipsis line-clamp-2 hover:text-blue-600"
                        style={{ display: "-webkit-box" }}
                      >
                        {cartItem.product.name}
                      </p>{" "}
                    </Link>
                    <div className="BRAND flex items-center gap-3 ">
                      {cartItem.product.brand?.name}
                    </div>
                    {cartItem.product.color && (
                      <span
                        className="w-5 h-5 rounded-full"
                        style={{ background: cartItem.product.color }}
                      ></span>
                    )}
                    <p>Only {cartItem.product.stock} items left.</p>
                    <div className="BUTTONS mt-5 flex justify-between">
                      <Input
                        type="number"
                        {...register(`${cartItem.product.id.toString()}_count`)}
                        defaultValue={cartItem.quantity}
                        value={cartItem.quantity}
                        onChange={async (e) => {
                          if (parseInt(e.target.value) < 1) return;
                          setValue(
                            `${cartItem.product.id.toString()}_count`,
                            e.target.value
                          );
                          if (e)
                            try {
                              const res = await api.patch(
                                `/customer/cart-items/${cartItem.id}`,
                                { quantity: parseInt(e.target.value) }
                              );
                              if (res)
                                toast({
                                  variant: "success",
                                  title: "Successfully changed quantity.",
                                });

                              loadCartItems();
                            } catch (error) {}
                        }}
                        className="max-w-56 border-orange-400"
                      />
                      <Button
                        variant={"destructive"}
                        className=""
                        onClick={() => deleteFromCart(cartItem.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <h2 className="my-2 font-bold text-xl flex items-baseline">
            {" "}
            Total: <IndianRupeeIcon className="h-[13px]" />{" "}
            {totalAmount?.toLocaleString("en-IN")}
          </h2>
          <div className="my-10 ">
            <Label>Address</Label>
            <Input
              className="border-orange-500 h-32"
              type="text"
              {...register("address")}
            />
            <Input
              className="border-orange-500 h-32 hidden"
              type="text"
              {...register("location")}
            />
            <Button
              variant={"default"}
              className="w-full my-2 ml-auto mr-0 right-0 text-xl bg-orange-800 text-white"
              onClick={(e) => onsubmit()}
            >
              Checkout now
            </Button>{" "}
          </div>
        </>
      ) : (
        <div>No products are added to the cart.</div>
      )}
    </section>
  );
}
