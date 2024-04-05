"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Order } from "@/entities/order.entity";
import api from "@/lib/axios";
import { useAppDispatch } from "@/lib/hooks";
import { remove_from_cart } from "@/lib/store/cartSlice";
import { AxiosError } from "axios";
import { IndianRupeeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Page() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>();
  const { register, getValues, watch, setValue } = useForm();
  const dispatch = useAppDispatch();

  useEffect(() => {
    loadOrders();
    return () => {};
  }, []);

  async function loadOrders() {
    try {
      const res = await api.get("/customer/orders");
      console.log({ orders });
      if (res) setOrders(res.data);
    } catch (error) {}
  }

  useEffect(() => {
    const total = orders.reduce((accumulator, currentValue) => {
      return (
        accumulator + currentValue.product.price_rupee * currentValue.quantity
      );
    }, 0);
    setTotalAmount(total);
    return () => {};
  }, [orders]);

  function onsubmit() {
    const formValues = getValues();
    let orderCount = 0;
    orders.forEach(async (order, index) => {
      const orderData = {
        productId: order.productId,
        customerId: "1",
        quantity: formValues[`${order.productId.toString()}_count`] || 1,
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

  async function deleteOrder(orderId: number) {
    try {
      const res = await api.delete(`/customer/orders/${orderId}`);
      if (res.data) {
        toast({
          title: "Removed from cart.",
        });
        loadOrders();
        dispatch(remove_from_cart({ id: orderId }));
      }
    } catch (error) {}
  }

  return (
    <section className="mt-5 container">
      {orders ? (
        <>
          <div className="grid grid-cols-1 grid-flow-row gap-0">
            {orders.map((order, index) => {
              return (
                <div
                  key={index}
                  className="border  overflow-hidden p-5 grid grid-rows-2 sm:grid-cols-[300px_1fr] sm:grid-rows-1 items-center justify-center"
                >
                  <Image
                    alt={order.product.name}
                    src={`${process.env.API_HOST}/${order?.product.thumb_image_url}`}
                    width={190}
                    height={190}
                    className="m-auto"
                  ></Image>
                  <div className="grid gap-2">
                    <h2 className="my-2 font-bold text-xl flex items-baseline">
                      {" "}
                      <IndianRupeeIcon className="h-[13px]" />{" "}
                      {order.product.price_rupee.toLocaleString("en-IN")}
                    </h2>
                    <hr />
                    <Link
                      href={`/products/${order?.product.name?.replaceAll(
                        " ",
                        "-"
                      )}?id=${order.product.id}`}
                    >
                      <p
                        className="h-12 text-ellipsis line-clamp-2 hover:text-blue-600"
                        style={{ display: "-webkit-box" }}
                      >
                        {order.product.name}
                      </p>{" "}
                    </Link>
                    <div className="BRAND flex items-center gap-3 ">
                      {order.product.brand?.name}
                    </div>
                    {order.product.color && (
                      <span
                        className="w-5 h-5 rounded-full"
                        style={{ background: order.product.color }}
                      ></span>
                    )}
                    <div className="BUTTONS mt-5">
                      <p className="max-w-56 border-orange-400">
                        Status: <b> {order.status}</b>
                      </p>
                      <p className="max-w-56 border-orange-400">
                        Quantity: <b> {order.quantity}</b>
                      </p>
                      {/* <Button
                        variant={"destructive"}
                        className=""
                        onClick={() => deleteOrder(order.id)}
                      >
                        Remove
                      </Button> */}
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
          {/* <div className="my-10 ">
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
          </div> */}
        </>
      ) : (
        <div>No products are added to the cart.</div>
      )}
    </section>
  );
}
