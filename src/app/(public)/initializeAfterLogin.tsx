"use client";
import api from "@/lib/axios";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { initialize_cart } from "@/lib/store/cartSlice";
import React, { useEffect } from "react";

export default function InitializeStoreAfterLogin() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => {
    return state.user.isLoggedIn;
  });

  useEffect(() => {
    let cartItemsFetched: any;
    async function getCartItems() {
      const res = await api.get(`/customer/cart-items`);
      cartItemsFetched = res.data;
    }
    if (user) {
      getCartItems().then(() => {
        dispatch(initialize_cart(cartItemsFetched));
      });
    }
    return () => {};
  }, [user, dispatch]);

  return <></>;
}
