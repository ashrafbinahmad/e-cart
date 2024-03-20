"use client";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-separator";
import { ShoppingBasket, Search, BaggageClaim } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Header() {
  const menuItems = [
    { label: "Home", url: "/" },
    { label: "About", url: "/about" },
    { label: "Contact", url: "/contact" },
  ];
  return (
    <header className="bg-slate-300 sticky top-0 ">
      <nav className="p-2  container">
        <div className="flex justify-between items-center">
          <div className="flex justify-between items-center shrink-0 grow mr-5">
            <h1 className="flex  items-center gap-2 ml-2 text-2xl font-bold text-slate-900 ">
              {" "}
              <ShoppingBasket /> E-Cart
            </h1>
            <div className="inline-flex items-center justify-end ">
              <Search className="" />
              <Input
                type="text"
                placeholder="Search"
                className="ml-4 w-40 focus:w-96 transition-all bg-transparent focus:bg-white cursor-pointer"
              />
            </div>
          </div>
          <div>
            <ul className="flex space-x-4 items-center">
              {menuItems.map((item, index) => (
                <MenuItem
                  key={index}
                  label={item.label}
                  url={item.url}
                  className=""
                />
              ))}
              <MenuItem
                label="Signup"
                url="/Signup"
                className="text-blue-500 font-bold"
              />
              <MenuItem
                label="Login"
                url="/login"
                className="text-blue-500 font-bold"
              />
              <BaggageClaim className="" />
              <Badge>1</Badge>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export const MenuItem = ({
  label,
  url,
  className,
}: {
  label: string;
  url: string;
  className?: React.ComponentProps<"a">["className"];
}) => {
  return (
    <li>
      <Link
        href={url}
        className={`text-slate-900 hover:text-slate-700 ${className}`}
      >
        {label}
      </Link>
    </li>
  );
};
