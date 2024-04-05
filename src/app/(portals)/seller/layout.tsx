"use client";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  SidebarMenuItem,
  SidebarMenuItemIcon,
  SidebarMenuItemText,
} from "@/components/ui/sidebar-menu";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  ArrowRightCircle,
  BookPlusIcon,
  HexagonIcon,
  LayoutDashboardIcon,
  Package2Icon,
  ShapesIcon,
  StarIcon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";
import ClientOnly from "@/components/customized/client-only";
import api from "@/lib/axios";
import { login } from "@/lib/store/userSlice";

type props = {
  children: React.ReactNode;
};
type MenuItem = {
  label: string;
  icon?: ReactNode;
  link: string;
};
export default function SellerLayout({ children }: props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const [isSeller, setIsSeller] = useState<boolean | "not checked">(
    "not checked"
  );

  useEffect(() => {
    const getIsAdmin = async () => {
      let isSeller_ = false;
      try {
        const res = await api.get("auth/whoami");
        isSeller_ = res?.data.userType === "SELLER";
        setIsSeller(isSeller_);
        dispatch(login(res.data));
      } catch (error) {
        if (!isSeller_) router.push("/login");
      }
    };
    getIsAdmin();
    return () => {};
  }, [router]);

  const MenuItems: MenuItem[] = [
    {
      label: "Dashboard",
      icon: <LayoutDashboardIcon />,
      link: "/seller/dashboard",
    },
    {
      label: "Products",
      icon: <ShapesIcon />,
      link: "/seller/products",
    },
    {
      label: "Orders",
      icon: <Package2Icon />,
      link: "/seller/orders",
    },
    {
      label: "Brands",
      icon: <HexagonIcon />,
      link: "/seller/brands",
    },
    {
      label: "Categories",
      icon: <BookPlusIcon />,
      link: "/seller/categories",
    },
    {
      label: "Reviews",
      icon: <StarIcon />,
      link: "/seller/reviews",
    },
  ];
  const seller = useAppSelector((state) => {
    return state.user.userData;
  });
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="flex overflow-scroll"
      style={{ overflow: "inherit" }}
    >
      <ResizablePanel
        defaultSize={20}
        className="max-w-56 sticky top-0 h-screen py-6 px-2 bg-slate-100 "
        onScroll={(e) => {
          e.preventDefault();
        }}
      >
        <ClientOnly className="h-24">
          <div>
            <div className="w-full text-center block">
              <div className="block mx-auto bg-red-400 rounded-full pt-[5px] w-8 h-8 font-bold text-white my-0">
                <span>{seller?.fullname?.toUpperCase()[0]}</span>
              </div>{" "}
            </div>
            <p className="text-black text-center">{seller?.fullname}</p>
          </div>
        </ClientOnly>
        {MenuItems.map((menuItem, index) => {
          return (
            <SideBarMenuItem
              key={index}
              icon={menuItem.icon}
              label={menuItem.label}
              link={menuItem.link}
            />
          );
        })}

        <div className="absolute bottom-4 w-full">
          <Button
            onClick={() => {
              router.push("/logout");
              router.push("/");
            }}
            variant={"destructive"}
            className="w-[calc(100%_-_1rem)]"
          >
            LOGOUT
          </Button>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel className="p-5  overflow-scroll">
        {/* <h1>Seller</h1> */}
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

const SideBarMenuItem = ({
  icon = <ArrowRightCircle />,
  label,
  link,
}: MenuItem) => {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = link.endsWith(pathname);
  return (
    <SidebarMenuItem
      className={isActive ? "bg-card border" : ""}
      onClick={() => {
        router.replace(link, { scroll: true });
      }}
    >
      <SidebarMenuItemIcon>{icon}</SidebarMenuItemIcon>
      <SidebarMenuItemText className={isActive ? "font-bold" : ""}>
        {label}
      </SidebarMenuItemText>
    </SidebarMenuItem>
  );
};
