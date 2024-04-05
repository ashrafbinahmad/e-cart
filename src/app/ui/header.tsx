"use client";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  PopoverTrigger,
  Popover,
  PopoverContent,
} from "@/components/ui/popover";
import { useAppSelector } from "@/lib/hooks";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ShoppingBasket,
  Search,
  BaggageClaim,
  AlignJustify,
  AlignJustifyIcon,
} from "lucide-react";
import Link from "next/link";
import React, { ReactNode, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "@/lib/store/userSlice";
import { ComboBox } from "@/components/ui/combobox";
import { Command } from "@/components/ui/command";
import { CommandInput } from "cmdk";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { usePathname, useSearchParams } from "next/navigation";
import { clear_cart } from "@/lib/store/cartSlice";
import { useRouter } from "next/navigation";

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [cartItemCount, setCartItemCount] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const user = useAppSelector((state) => {
    // setCartItemCount(state.cart.cartItems.length)
    return state?.user;
  });
  const cartItems = useAppSelector((state) => {
    return state.cart.cartItems;
  });

  useEffect(() => {
    setCartItemCount(cartItems.length);

    return () => {};
  }, [cartItemCount, setCartItemCount, cartItems]);

  useEffect(() => {
    async function getSuggestions() {
      const res = await axios.post(
        `${process.env.API_HOST}/search-suggestions`,
        { search: searchText }
      );
      setSearchSuggestions(res.data);
    }
    getSuggestions();
    return () => {};
  }, [searchText, searchParams]);

  useEffect(() => {
    if (searchParams.get("search"))
      setSearchText(searchParams.get("search") || "");
  }, [searchParams]);

  const menuItems = [
    { label: "Home", url: "/", onlyIfLoggedIn: false },
    // { label: "About", url: "/about", onlyIfLoggedIn: false },
    // { label: "Contact", url: "/contact", onlyIfLoggedIn: false },
    { label: "My orders", url: "/orders", onlyIfLoggedIn: true },
    {
      label: (
        <div className="relative text-center m-auto">
          <Link href={"/cart"}>
            <BaggageClaim className="text-center" />
          </Link>
          <span className="absolute -top-4 left-4 text-[10px] w-5 h-5 sm:bg-black rounded-xl text-center p-1">
            {cartItemCount}
          </span>
        </div>
      ),
      url: "/orders",
      onlyIfLoggedIn: true,
    },
  ];
  return (
    <header className="bg-orange-600 sticky top-0">
      <nav className="p-2  container">
        <div className="flex justify-between items-center">
          <div className="flex items-center grow mr-5">
            <Link href={"/"}>
              <h1 className="flex  items-center ml-2 text-2xl font-bold text-slate-100 ">
                {" "}
                <ShoppingBasket /> E-Cart
              </h1>
            </Link>
            <div className="flex items-center  ml-5">
              <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                <PopoverTrigger>
                  <Input
                    type="text"
                    placeholder="Search for products"
                    className="ml-4 w-60 transition-all bg-orange-200 cursor-pointer placeholder:text-orange-700 text-black"
                    onFocus={() => setSearchOpen(true)}
                    onChange={(e) => {
                      setSearchOpen(true);
                      setSearchText(e.target.value);
                    }}
                    value={searchText}
                  />
                </PopoverTrigger>
                <PopoverContent className="bg-transparent border-none shadow-none -mt-[3.8rem] ml-[2.5rem]">
                  <Input
                    type="text"
                    placeholder="Search for products"
                    className="w-96 transition-all bg-white cursor-pointer placeholder:text-white text-black"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                  {searchText && (
                    <Card className="p-3 mt-2 w-96">
                      {searchSuggestions.map((suggestion, index) => (
                        <Link
                          href={`?search=${suggestion.replaceAll(" ", "+")}`}
                          onClick={() => setSearchOpen(false)}
                          key={index}
                          className=""
                        >
                          <p className="border-t p-2 hover:bg-gray-100 cursor-pointer w-full">
                            {suggestion}
                          </p>
                        </Link>
                      ))}
                    </Card>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div>
            <AlignJustifyIcon
              onClick={() => setIsMenuOpen((state) => !state)}
              className={`block sm:hidden`}
            />
            <ul
              className={`space-x-4 items-center ${
                isMenuOpen
                  ? "grid justify-center content-center sm:hidden bg-white w-1/2 gap-5 absolute text-black  right-0 h-screen"
                  : "hidden sm:flex"
              }`}
            >
              {menuItems
                .filter((item) => item.onlyIfLoggedIn === false)
                .map((item, index) => (
                  <>
                    <MenuItem
                      key={index}
                      label={item.label}
                      url={item.url}
                      className="sm:text-gray-100 sm:hover:text-white"
                    />
                  </>
                ))}
              {!user.isLoggedIn ? (
                <>
                  <MenuItem
                    label="Signup"
                    url="/Signup"
                    className="sm:text-gray-100 sm:hover:text-white"
                  />
                  <MenuItem
                    label="Login"
                    url="/login"
                    className="sm:text-gray-100 font-bold sm:hover:text-white"
                  />
                </>
              ) : (
                <>
                  {menuItems
                    .filter((item) => item.onlyIfLoggedIn === true)
                    .map((item, index) => (
                      <MenuItem
                        key={index}
                        label={item.label}
                        url={item.url}
                        className="sm:text-gray-100 font-bold sm:hover:text-white"
                      />
                    ))}
                  <li>
                    <Popover>
                      <PopoverTrigger>
                        <Avatar>
                          <AvatarFallback className="font-bold bg-red-400 p-2 rounded-full text-white">
                            {user.userData?.fullname[0]}
                            {user.userData?.fullname.split(" ")[1]?.[0]}
                          </AvatarFallback>{" "}
                        </Avatar>
                      </PopoverTrigger>
                      <PopoverContent>
                        <p className="font-bold text-center">
                          {user.userData?.fullname}
                        </p>
                        <p className="text-center text-xs text-gray-800 mb-3">
                          ({user.userData?.email})
                        </p>
                        <button
                          className="w-full p-2 hover:bg-slate-300 transition-all"
                          onClick={() => {
                            dispatch(clear_cart());
                            router.push(`/logout?next=${pathname}`);
                            // router.back()
                          }}
                        >
                          Logout
                        </button>
                        {/* <button className="w-full p-2 hover:bg-slate-300 transition-all" onClick={()=> {dispatch(logout())}}>Edit profile</button> */}
                      </PopoverContent>
                    </Popover>
                  </li>
                </>
              )}
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
  label: string | ReactNode;
  url: string;
  className?: React.ComponentProps<"a">["className"];
}) => {
  return (
    <li className="ml-0">
      <Link href={url} className={` ${className}`}>
        {label}
      </Link>
    </li>
  );
};
