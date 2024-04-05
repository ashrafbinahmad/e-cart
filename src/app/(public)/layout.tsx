// "use client";

import Header from "../ui/header";
import Footer from "../ui/footer";
import { useAppSelector } from "@/lib/hooks";
import { useEffect } from "react";
import InitializeStoreAfterLogin from "./initializeAfterLogin";

export default function PublicLayout(props: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      <div>{props.modal}</div>
      <InitializeStoreAfterLogin />
      <Header />
      <main className="min-h-screen">{props.children}</main>
      <Footer />
    </>
  );
}
