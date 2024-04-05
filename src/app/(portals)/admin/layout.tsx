"use client";;
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
  Shield,
  StarIcon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";
import ClientOnly from "@/components/customized/client-only";
import api from "@/lib/axios";
import { Toast, ToastProvider } from "@radix-ui/react-toast";
import { login } from "@/lib/store/userSlice";

type props = {
  children: React.ReactNode;
};
type MenuItem = {
  label: string;
  icon?: ReactNode;
  link: string;
};
export default function AdminLayout({ children }: props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | "not checked">(
    "not checked"
  );

  useEffect(() => {
    const getIsAdmin = async () => {
      const res = await api.get("auth/whoami");
      const isAdmin_ = res.data.userType === "ADMIN";
      setIsAdmin(isAdmin_);
      if (!isAdmin_) router.push("/admin-login");
      dispatch(login(res.data))
    };
    getIsAdmin();
    return () => {};
  }, [router, dispatch]);

  const MenuItems: MenuItem[] = [
    {
      label: "Dashboard",
      icon: <LayoutDashboardIcon />,
      link: "/admin/dashboard",
    },
    {
      label: "Sellers",
      icon: <ShapesIcon />,
      link: "/admin/sellers",
    },
    {
      label: "Orders",
      icon: <Package2Icon />,
      link: "/admin/orders",
    },
    {
      label: "Customers",
      icon: <Package2Icon />,
      link: "/admin/customers",
    },
    {
      label: "Products",
      icon: <Package2Icon />,
      link: "/admin/products",
    },
    {
      label: "Brands",
      icon: <HexagonIcon />,
      link: "/admin/brands",
    },
    {
      label: "Categories",
      icon: <BookPlusIcon />,
      link: "/admin/categories",
    },
    {
      label: "Reviews",
      icon: <StarIcon />,
      link: "/admin/reviews",
    },
    {
      label: "Customer carts",
      icon: <StarIcon />,
      link: "/admin/customer-carts",
    },
  ];
  const admin = useAppSelector((state) => {
    return state.user.userData;
  });
  return (
    <ToastProvider>
      {isAdmin != "not checked" && isAdmin ? (
        <ResizablePanelGroup
          direction="horizontal"
          className="flex overflow-scroll "
          style={{ overflow: "inherit" }}
        >
          <ResizablePanel
            defaultSize={20}
            className="max-w-56 sticky top-0 h-screen py-6 px-2 bg-green-100 "
            onScroll={(e) => {
              e.preventDefault();
            }}
          >
            <ClientOnly className="h-24">
              <div className="text-center">
                <Shield className="m-auto size-10 stroke-green-800" />
                <div className="w-full text-center block font-bold text-green-900">
                  ADMIN PANEL
                </div>
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
                  router.push("/admin-login");
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
            {/* <h1>admin</h1> */}
            {children}
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        ""
      )}
      <Toast />
    </ToastProvider>
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
