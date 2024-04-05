"use client";

import * as React from "react";
// import Select from "react-select";
import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableOrderType } from "./tableType";
import { getData } from "./getData";
import Image from "next/image";
import api from "@/lib/axios";
import { Brand } from "@/entities/brand.entity";
import { getBrands, getCategories, getProducts } from "@/lib/get-public-data";
import { useToast } from "@/components/ui/use-toast";
import {
  FormField,
  PostOrPatchDialog,
} from "@/components/customized/post-or-patch-dialog";
import { useAppSelector } from "@/lib/hooks";
import EntityDataTable from "@/components/customized/entity-data-table";
import { Order } from "@/entities/order.entity";
import { Customer } from "@/entities/customer.entity";
import { getCustomers } from "@/lib/get-admin-accessible-data";
import { Product } from "@/entities/product.entity";

export const deleteOrder = async (id: number) => {
  try {
    const res = await api.delete(`/seller/orders/${id}`);
  } catch (error) {
    throw error;
  }
};
export default function Page() {
  const [orders, setOrders] = React.useState<TableOrderType[]>([]);
  const [showDialogue, setshowDialogue] = React.useState<boolean | undefined>(
    undefined
  );
  const [edittingId, setEdittingId] = React.useState<number | string>();
  const [edittingOrder, setEdittingOrder] = React.useState<Order>();
  const [customers, setCustomers] = React.useState<Customer[]>();
  const [products, setProducts] = React.useState<Product[]>();

  const user = useAppSelector((state) => {
    return state.user.userData;
  });

  const { toast } = useToast();

  React.useEffect(() => {
    loadData();
    const setCustomersAndProductsData = async () => {
      const customersData = await getCustomers();
      setCustomers(customersData);
      const productsData = await getProducts();
      setProducts(productsData);
    };
    setCustomersAndProductsData();
    return () => {};
  }, []);

  React.useEffect(() => {
    const getEdittingOrder = async () => {
      try {
        const res = await api.get(`/public/orders/${edittingId}`);
        setEdittingOrder(res.data);
      } catch (error) {
        throw error;
      }
    };
    getEdittingOrder();
    return () => {};
  }, [edittingId]);

  const loadData = () => {
    const setOrderssData = async () => {
      const data = await getData();
      setOrders(data);
    };
    setOrderssData();
  };

  const formFields: FormField[] = [
    {
      label: "Customer",
      name: "customerId",
      type: "select",
      required: true,
      options: customers?.map((customer) => {
        return {
          id: customer.id,
          name: customer.fullname,
        };
      }),
    },
    {
      label: "Product",
      name: "productId",
      type: "select",
      required: true,
      options: products?.map((product) => {
        return {
          ...product,
          icon_src: `${process.env.API_HOST}/${product.thumb_image_url}`,
        };
      }),
    },
    {
      label: "Quantity",
      name: "quantity",
      type: "number",
    },
    {
      label: "Address",
      name: "address",
      type: "text",
    },
    {
      label: "Location",
      name: "location",
      type: "text",
    },
  ];

  const columns: ColumnDef<TableOrderType>[] = [
    {
      id: "Select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Id
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "customerId",
      header: "Customer id",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <Image
            alt=""
            src={`${process.env.API_HOST}/${order.product.thumb_image_url}`}
            height={40}
            width={40}
          />
        );
      },
    },
    {
      accessorKey: "cutomer.email",
      header: "Customer",
      cell: ({ row }) => (
        <div className="lowercase w-60">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "productId",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("price_rupee")}</div>
      ),
    },
    {
      accessorKey: "product.name",
      header: "Product",
    },
    {
      accessorKey: "quantity",
      header: "quantity",
    },
    {
      accessorKey: "address",
      header: "Address",
      enableGlobalFilter: true,
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "brand.name",
      header: "Brand",
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const order = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(order?.id.toString())
                }
              >
                Copy payment ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  onDeleteClick([order]);
                }}
              >
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  onEditClick(order?.id);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const onDeleteClick = async (selectedRowValues: TableOrderType[]) => {
    selectedRowValues.forEach(async (orderRow) => {
      await deleteOrder(orderRow?.id)
        .then(() =>
          toast({
            // variant: "destructive",
            role: "alert",
            title: "Deleted order",
          })
        )
        .catch((error) =>
          toast({
            variant: "destructive",
            title: "Unable to delete",
            description: error?.response?.data?.message,
          })
        );
      loadData();
    });
  };

  const onEditClick = (id: string | number) => {
    setEdittingId(id);
    setshowDialogue(true);
  };

  const onPostOrPatchDialogOpenChange = (open: boolean) => {
    setshowDialogue(open);
    setEdittingId((state) => {
      return open ? state : undefined;
    });
  };

  return (
    <div className="container mx-auto ">
      <PostOrPatchDialog
        showDialogue={showDialogue}
        onOpenChange={(open) => onPostOrPatchDialogOpenChange(open)}
        formFields={formFields}
        postOrPatchOrGetOneEndPoint="/seller/orders"
        postOrPatchEntity="Order"
        patchingItem={edittingOrder}
        isPatch={edittingId != undefined}
        patchingId={edittingId?.toString()}
        afterSubmit={() => {
          loadData();
          setEdittingId(undefined);
        }}
      />
      <EntityDataTable
        columns={columns}
        data={orders}
        onDeleteClick={(selectedRowValues) => onDeleteClick(selectedRowValues)}
        // onAddClick={() => {
        //   setEdittingId(undefined);
        //   setEdittingOrder(undefined);
        //   setshowDialogue(true);
        // }}
      />
    </div>
  );
}
