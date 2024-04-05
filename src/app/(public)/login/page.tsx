"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { login } from "@/lib/store/userSlice";
import api from "@/lib/axios";
import { Router } from "next/router";
import { Modal } from "@/components/ui/modal";

export default function LoginModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      email: "samsung@gmail.com",
      password: "123456",
    },
  });
  const onSubmit = async (data: Object) => {
    let loginResponse;
    try {
      loginResponse = await axios.post(
        `${process.env.API_HOST}/auth/customer/login`,
        data
      );
    } catch (error) {
      try {
        loginResponse = await axios.post(
          `${process.env.API_HOST}/auth/seller/login`,
          data
        );
      } catch (error) {}
    }
    const tokens: { access_token: string; refresh_token: string } =
      loginResponse?.data;

    localStorage.setItem("accessToken", tokens.access_token);
    localStorage.setItem("refreshToken", tokens.refresh_token);

    const userData: UserState = (
      await api.get(`${process.env.API_HOST}/auth/whoami`)
    ).data;
    console.log({ userData });
    if (!userData) return;
    dispatch(login(userData));
    if (userData.userType === "CUSTOMER")
      location.pathname = searchParams.get("next") || "/";
    else if (userData.userType === "SELLER") router.push("seller");
    else if (userData.userType === "ADMIN") router.push("admin");
  };
  return (
    <div className="w-96 grid content-center justify-center m-auto h-screen">
      <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            {...register("email")}
            type="email"
            id="email"
            placeholder="Email"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            {...register("password")}
            type="password"
            id="password"
            placeholder="Password"
          />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
