"use client";
import Link from "next/link";
import { headers } from "next/headers";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="grid content-center justify-center h-screen text-center">
      <h2 className="text-xl font-bold">Not Found</h2>
      <p>Could not find requested resource</p>
      <Button className="mt-5" onClick={() => router.back()}>Go back</Button>
    </div>
  );
}
