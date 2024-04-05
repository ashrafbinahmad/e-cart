"use client";
import { useAppDispatch } from "@/lib/hooks";
import { logout } from "@/lib/store/userSlice";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

export default function Page() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    dispatch(logout());
    return () => {
      // router.push(`/login?next=${searchParams.get("next")}`);
      router.push(`/`);
    };
  }, []);

  return <div>Logging out.</div>;
}
