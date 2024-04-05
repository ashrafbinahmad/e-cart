"use client";
import { Provider } from "react-redux";
import { store } from "../lib/store";
import { Inter } from "next/font/google";
import "./globals.css";
import { saveState } from "@/lib/store/browserStorage";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  store.subscribe(() => {
    saveState(store.getState());
  });

  
  return (
    <Provider store={store}>
      <html lang="en" className="">
        <body className={inter.className}>
          {children} 
          <div id="modal-root" />
          <Toaster />
        </body>
      </html>
    </Provider>
  );
}
