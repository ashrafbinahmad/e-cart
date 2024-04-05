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
import { TableProductCategoryType } from "./tableType";
import { getData } from "./getData";
import Image from "next/image";
import api from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";
import {
  FormField,
  PostOrPatchDialog,
} from "@/components/customized/post-or-patch-dialog";
import { useAppSelector } from "@/lib/hooks";
import EntityDataTable from "@/components/customized/entity-data-table";
import { Customer } from "@/entities/customer.entity";
import { getCustomers } from "@/lib/get-admin-accessible-data";
import { Product } from "@/entities/product.entity";
import { ProductCategory } from "@/entities/product-category.entity";

export const deleteCategory = async (id: number) => {
  try {
    const res = await api.delete(`/admin/categories/${id}`);
  } catch (error) {
    throw error;
  }
};
export default function Page() {
  const [categories, setCategories] = React.useState<TableProductCategoryType[]>([]);
  const [showDialogue, setshowDialogue] = React.useState<boolean | undefined>(
    undefined
  );
  const [edittingId, setEdittingId] = React.useState<number | string>();
  const [edittingCategory, setEdittingCategory] = React.useState<ProductCategory>();
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
      // const productsData = await getProducts();
      // setProducts(productsData);
    };
    setCustomersAndProductsData();
    return () => {};
  }, []);

  React.useEffect(() => {
    const getEdittingCategory = async () => {
      try {
        const res = await api.get(`/public/categories/${edittingId}`);
        setEdittingCategory(res.data);
      } catch (error) {
        throw error;
      }
    };
    getEdittingCategory();
    return () => {};
  }, [edittingId]);

  const loadData = () => {
    const setCategoriesData = async () => {
      const data = await getData();
      setCategories(data);
    };
    setCategoriesData();
  };

  const formFields: FormField[] = [
    {
      label: "Name",
      name: "name",
      type: "text",
      required: true,
    },
    {
      label: "Logo",
      name: "icon_url",
      type: "file",
      required: true,
    },
  ];

  const columns: ColumnDef<TableProductCategoryType>[] = [
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
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="w-60">{row.getValue("name")}</div>,
    },
    {
      id: "Icon",
      header: "Icon",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <Image
            alt=""
            src={`${process.env.API_HOST}/${product.icon_url}`}
            className="w-auto h-auto"
            height={40}
            width={40}
          />
        );
      },
    },
  ];

  const onDeleteClick = async (selectedRowValues: TableProductCategoryType[]) => {
    selectedRowValues.forEach(async (categoryRow) => {
      await deleteCategory(categoryRow?.id)
        .then(() =>
          toast({
            // variant: "destructive",
            role: "alert",
            title: "Deleted category",
          })
        )
        .catch((error) =>
          toast({
            variant: "destructive",
            title: error?.response.data.message,
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
        postOrPatchOrGetOneEndPoint="/admin/product-categories"
        postOrPatchEntity="Category"
        patchingItem={edittingCategory}
        isPatch={edittingId != undefined}
        patchingId={edittingId?.toString()}
        afterSubmit={() => {
          loadData();
          setEdittingId(undefined);
        }}
      />
      <EntityDataTable
        columns={columns}
        data={categories}
        onDeleteClick={(selectedRowValues) => onDeleteClick(selectedRowValues)}
        onAddClick={() => {
          setEdittingId(undefined);
          setEdittingCategory(undefined);
          setshowDialogue(true);
        }}
      />
    </div>
  );
}
