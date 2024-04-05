"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toast } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

export default function Page() {
  const { register, handleSubmit, getValues } = useForm();
  const router = useRouter();
  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const formdata = getValues();
    try {
      const res = await api.post("auth/admin/login", formdata);
      const tokens: Tokens = res.data;
      localStorage.setItem("accessToken", tokens.access_token);
      localStorage.setItem("refreshToken", tokens.refresh_token);
      router.push("/admin");
      toast({
        variant: "success",
        title: "Successful."
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error?.response?.data.message,
      });
    }
  };
  return (
    <div className="grid h-screen w-screen justify-center items-center">
      <form className="grid gap-2 w-sm" onSubmit={(e) => onSubmit(e)}>
        <Input {...register("username")} type="text" name="username" />
        <Input {...register("password")} type="password" name="password" />
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
