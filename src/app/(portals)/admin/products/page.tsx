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
import { TableProductType } from "./tableType";
import { getData } from "./getData";
import Image from "next/image";
import api from "@/lib/axios";
import { ProductCategory } from "@/entities/product-category.entity";
import { Brand } from "@/entities/brand.entity";
import { getBrands, getCategories } from "@/lib/get-public-data";
import { useToast } from "@/components/ui/use-toast";
import {
  FormField,
  PostOrPatchDialog,
} from "@/components/customized/post-or-patch-dialog";
import { useAppSelector } from "@/lib/hooks";
import EntityDataTable from "@/components/customized/entity-data-table";
import { Product } from "@/entities/product.entity";
import { Seller } from "@/entities/seller.entity";
import { getSellers } from "@/lib/get-admin-accessible-data";

export const deleteProduct = async (id: number) => {
  try {
    const res = await api.delete(`/admin/products/${id}`);
  } catch (error) {
    throw error;
  }
};
export default function Page() {
  const [products, setProducts] = React.useState<TableProductType[]>([]);
  const [categories, setCategories] = React.useState<ProductCategory[]>([]);
  const [brands, setBrands] = React.useState<Brand[]>([]);
  const [sellers, setSellers] = React.useState<Seller[]>([]);
  const [showDialogue, setshowDialogue] = React.useState<boolean | undefined>(
    undefined
  );
  const [edittingId, setEdittingId] = React.useState<number | string>();
  const [edittingProduct, setEdittingProduct] = React.useState<Product>();

  const user = useAppSelector((state) => {
    return state.user.userData;
  });

  const { toast } = useToast();

  React.useEffect(() => {
    loadData();
    const setCategoriesAndBrandsAndSellersData = async () => {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
      const brandsData = await getBrands();
      setBrands(brandsData);
      const sellersData = await getSellers();
      setSellers(sellersData);
    };
    setCategoriesAndBrandsAndSellersData();
    return () => {};
  }, []);

  React.useEffect(() => {
    const getEdittingProduct = async () => {
      try {
        const res = await api.get(`/public/products/${edittingId}`);
        setEdittingProduct(res.data);
      } catch (error) {
        throw error;
      }
    };
    getEdittingProduct();
    return () => {};
  }, [edittingId, showDialogue, edittingProduct]);

  const loadData = () => {
    const setProductsData = async () => {
      const data = await getData();
      setProducts(data);
    };
    setProductsData();
  };

  const formFields: FormField[] = [
    {
      label: "Name",
      name: "name",
      type: "text",
      // required: true,
    },
    {
      label: "Color",
      name: "color",
      type: "text",
    },
    {
      label: "Material",
      name: "material",
      type: "text",
    },
    {
      label: "Weight",
      name: "weight_grams",
      type: "number",
    },
    {
      label: "MRP",
      name: "price_rupee",
      type: "number",
      // required: true,
    },
    {
      label: "Offer price",
      name: "offer_price_rupee",
      type: "number",
    },
    {
      label: "Stock",
      name: "stock",
      type: "number",
      // required: true,
    },
    {
      label: "Thumb",
      name: "thumb_image_url",
      type: "file",
      // required: true,
    },
    {
      label: "Image 1",
      name: "image_1_url",
      type: "file",
    },
    {
      label: "Image 2",
      name: "image_2_url",
      type: "file",
    },
    {
      label: "Image 3",
      name: "image_3_url",
      type: "file",
    },
    {
      label: "Brand",
      name: "brandId",
      type: "select",
      options: brands.map((brand) => {
        return {
          ...brand,
          icon_src: `${process.env.API_HOST}/${brand.logo_url}`,
        };
      }),
    },
    {
      label: "Category",
      name: "product_categoryId",
      type: "select",
      options: categories,
    },
    {
      label: "Seller",
      name: "sellerId",
      type: "select",
      options: sellers.map((seller) => {
        return {
          ...seller,
          name: `${seller.company_name} : ${seller.email}`,
        };
      }),
    },
  ];

  const columns: ColumnDef<TableProductType>[] = [
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
      id: "thumb",
      header: "Thumbnail image",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <Image
            alt=""
            src={`${process.env.API_HOST}/${product.thumb_image_url}`}
            className="w-auto h-auto"
            height={40}
            width={40}
          />
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="lowercase w-60">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "price_rupee",
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
      accessorKey: "offer_price_rupee",
      header: "Offer price",
    },
    {
      accessorKey: "stock",
      header: "Stock",
    },
    {
      accessorKey: "color",
      header: "Color",
      enableGlobalFilter: true,
    },
    {
      accessorKey: "material",
      header: "Material",
    },
    {
      accessorKey: "brand.name",
      header: "Brand",
    },
    {
      accessorKey: "product_category.name",
      header: "Category",
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const product = row.original;

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
                  navigator.clipboard.writeText(product?.id.toString())
                }
              >
                Copy payment ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  onDeleteClick([product]);
                }}
              >
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  onEditClick(product?.id);
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

  const onDeleteClick = async (selectedRowValues: TableProductType[]) => {
    selectedRowValues.forEach(async (productRow) => {
      await deleteProduct(productRow?.id)
        .then(() =>
          toast({
            // variant: "destructive",
            role: "alert",
            title: "Deleted product",
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
        postOrPatchOrGetOneEndPoint="/admin/products"
        postOrPatchEntity="Product"
        patchingItem={edittingProduct}
        isPatch={edittingId != undefined}
        patchingId={edittingId?.toString()}
        afterSubmit={() => {
          loadData();
          setEdittingId(undefined);
        }}
      />
      <EntityDataTable
        columns={columns}
        data={products}
        onDeleteClick={(selectedRowValues) => onDeleteClick(selectedRowValues)}
        onAddClick={() => {
          setEdittingId(undefined);
          setEdittingProduct(undefined);
          setshowDialogue(true);
        }}
      />
    </div>
  );
}
