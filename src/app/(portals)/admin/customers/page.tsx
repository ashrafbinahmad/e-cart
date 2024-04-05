"use client";;
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
import { TableCustomerType } from "./tableType";
import { getData } from "./getData";
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
import { Customer } from "@/entities/customer.entity";

export const deleteCustomer = async (id: number) => {
  try {
    const res = await api.delete(`/admin/customers/${id}`);
  } catch (error) {
    throw error;
  }
};
export default function Page() {
  const [customers, setCustomers] = React.useState<TableCustomerType[]>([]);
  const [categories, setCategories] = React.useState<ProductCategory[]>([]);
  const [brands, setBrands] = React.useState<Brand[]>([]);
  const [showDialogue, setshowDialogue] = React.useState<boolean | undefined>(
    undefined
  );
  const [edittingId, setEdittingId] = React.useState<number | string>();
  const [edittingCustomer, setEdittingCustomer] = React.useState<Customer>();

  const user = useAppSelector((state) => {
    return state.user.userData;
  });

  const { toast } = useToast();

  React.useEffect(() => {
    loadData();
    const setCategoriesAndBrandsData = async () => {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
      const brandsData = await getBrands();
      setBrands(brandsData);
    };
    setCategoriesAndBrandsData();
    return () => {};
  }, []);

  React.useEffect(() => {
    const getEdittingCustomer = async () => {
      try {
        const res = await api.get(`/admin/customers/${edittingId}`);
        setEdittingCustomer(res.data);
      } catch (error) {
        throw error;
      }
    };
    if (edittingId) getEdittingCustomer();
    return () => {};
  }, [edittingId]);

  const loadData = () => {
    const setCustomersData = async () => {
      const data = await getData();
      setCustomers(data);
    };
    setCustomersData();
  };

  const formFields: FormField[] = [
    {
      label: "Email",
      name: "email",
      type: "email",
      required: true,
    },
    {
      label: "Password",
      name: "password",
      type: "password",
    },
    {
      label: "Fullname",
      name: "fullname",
      type: "text",
    },
  ];

  const columns: ColumnDef<TableCustomerType>[] = [
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
      accessorKey: "fullname",
      header: "Full name",
      cell: ({ row }) => (
        <div className="lowercase w-60">{row.getValue("fullname")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "hash",
      header: "Password hash",
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const rowdata = row.original;

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
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  onDeleteClick([rowdata]);
                }}
              >
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  onEditClick(rowdata?.id);
                }}
              >
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const onDeleteClick = async (selectedRowValues: TableCustomerType[]) => {
    selectedRowValues.forEach(async (rowdata) => {
      await deleteCustomer(rowdata?.id)
        .then(() =>
          toast({
            // variant: "destructive",
            role: "alert",
            title: "Deleted customer",
          })
        )
        .catch((error) =>
          toast({
            variant: "destructive",
            title: "Unable to delete",
            description: error?.response?.data?.message
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
        postOrPatchOrGetOneEndPoint="/admin/customers"
        postOrPatchEntity="Customer"
        patchingItem={edittingCustomer}
        isPatch={edittingId != undefined}
        patchingId={edittingId?.toString()}
        afterSubmit={() => {
          loadData();
          setEdittingId(undefined);
        }}

      />
      <EntityDataTable
        columns={columns}
        data={customers}
        onDeleteClick={(selectedRowValues) => onDeleteClick(selectedRowValues)}
        onAddClick={() => {
          setEdittingId(undefined);
          setEdittingCustomer(undefined);
          setshowDialogue(true);
        }}
      />
    </div>
  );
}
