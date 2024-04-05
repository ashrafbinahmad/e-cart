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
import { TableReviewType } from "./tableType";
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
import { Customer } from "@/entities/customer.entity";
import { getCustomers } from "@/lib/get-admin-accessible-data";
import { Product } from "@/entities/product.entity";
import { Review } from "@/entities/review.entity";

export const deleteReview = async (id: number) => {
  try {
    const res = await api.delete(`/admin/reviews/${id}`);
  } catch (error) {
    throw error;
  }
};
export default function Page() {
  const [reviews, setReviews] = React.useState<TableReviewType[]>([]);
  const [showDialogue, setshowDialogue] = React.useState<boolean | undefined>(
    undefined
  );
  const [edittingId, setEdittingId] = React.useState<number | string>();
  const [edittingReview, setEdittingReview] = React.useState<Review>();
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
    const getEdittingReview = async () => {
      try {
        const res = await api.get(`/admin/reviews/${edittingId}`);
        setEdittingReview(res.data);
      } catch (error) {
        throw error;
      }
    };
    getEdittingReview();
    return () => {};
  }, [edittingId]);

  const loadData = () => {
    const setReviewsData = async () => {
      const data = await getData();
      setReviews(data);
    };
    setReviewsData();
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
      name: "logo_url",
      type: "file",
      required: true,
    },
  ];

  const columns: ColumnDef<TableReviewType>[] = [
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
      accessorKey: "product.name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Product
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="w-60">{row.getValue("name")}</div>,
    },
    {
      id: "product image",
      header: "Thumbnail",
      cell: ({ row }) => {
        const review = row.original;
        return (
          <Image
            alt=""
            src={`${process.env.API_HOST}/${review.product.thumb_image_url}`}
            className="w-auto h-auto"
            height={40}
            width={40}
          />
        );
      },
    },
    {
      accessorKey: "productId",
      header: "product",
    },
    {
      accessorKey: "comment",
      header: "Comment",
    },
    {
      accessorKey: "customerId",
      header: "Customer Id",
    },
    {
      accessorKey: "stars",
      header: "Stars",
    },
  ];

  const onDeleteClick = async (selectedRowValues: TableReviewType[]) => {
    selectedRowValues.forEach(async (reviewRow) => {
      await deleteReview(reviewRow?.id)
        .then(() =>
          toast({
            // variant: "destructive",
            role: "alert",
            title: "Deleted review",
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
        postOrPatchOrGetOneEndPoint="/admin/reviews"
        postOrPatchEntity="Review"
        patchingItem={edittingReview}
        isPatch={edittingId != undefined}
        patchingId={edittingId?.toString()}
        afterSubmit={() => {
          loadData();
          setEdittingId(undefined);
        }}
      />
      <EntityDataTable
        columns={columns}
        data={reviews}
        onDeleteClick={(selectedRowValues) => onDeleteClick(selectedRowValues)}
        onAddClick={() => {
          setEdittingId(undefined);
          setEdittingReview(undefined);
          setshowDialogue(true);
        }}
      />
    </div>
  );
}
