"use client";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dispatch,
  HTMLInputTypeAttribute,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Sheet } from "lucide-react";
import { FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import api from "@/lib/axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AxiosError } from "axios";
import { Product } from "@/entities/product.entity";
import { Brand } from "@/entities/brand.entity";
import { ProductCategory } from "@/entities/product-category.entity";
import { CartItem } from "@/entities/cart-item.entity";
import { Order } from "@/entities/order.entity";
import { Review } from "@/entities/review.entity";
import { Customer } from "@/entities/customer.entity";
import { Seller } from "@/entities/seller.entity";
import { ComboBox } from "../ui/combobox";

interface SelectOption {
  id: string | number;
  name: string;
}


export type FormField = {
  name: string;
  label: string;
  type: HTMLInputTypeAttribute | undefined | "select";
  options?: SelectOption[];
  value?: string;
  hidden?: boolean;
  defaultValue?: any;
  required?: boolean;
};

type PatchingItemKey =
  | keyof Brand
  | keyof ProductCategory
  | keyof CartItem
  | keyof Order
  | keyof Review
  | keyof Customer
  | keyof Seller;

type PatchingItem =
  | Brand
  | ProductCategory
  | CartItem
  | Order
  | Review
  | Customer
  | Seller;

type PropsType = {
  showDialogue: boolean | undefined;
  onOpenChange: (open: boolean) => void;
  formFields: FormField[];
  postOrPatchOrGetOneEndPoint: string;
  postOrPatchEntity: string;
  patchingItem?: PatchingItem;
  afterSubmit?: () => void | undefined;
  isPatch?: boolean;
  patchingId?: string | undefined;
};

export function PostOrPatchDialog({
  showDialogue,
  onOpenChange,
  formFields,
  postOrPatchOrGetOneEndPoint,
  postOrPatchEntity,
  patchingItem,
  patchingId,
  isPatch = false,
  afterSubmit = () => {},
}: PropsType) {
  const { register, reset, setValue, resetField } = useForm({
    values: isPatch ? patchingItem : undefined,
  });

  const [addOrEdit, setAddOrEdit] = useState<"ADD" | "EDIT">(
    isPatch ? "EDIT" : "ADD"
  );

  useEffect(() => {
    setAddOrEdit(isPatch ? "EDIT" : "ADD");
    reset();

    return () => {};
  }, [patchingId, open]);

  const resetFormFields = () => {
    formFields.forEach((field) => {
      setValue(field.name as PatchingItemKey, "");
    });
  };

  useEffect(() => {
    if (!isPatch) resetFormFields();
  }, [addOrEdit, isPatch, reset, open]);

  return (
    <Dialog
      open={showDialogue}
      onOpenChange={(open) => {
        // if (!isPatch) resetFormFields();
        onOpenChange(open);
      }}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="mx-3">{`${addOrEdit} ${postOrPatchEntity} ${
            addOrEdit == "EDIT" ? " Id: " + patchingId : ""
          }`}</SheetTitle>
          <form
            className=""
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);

              var object: any = {};
              formData.forEach(function (value: any, key: string): any {
                object[key] = value;
              });
              var json = JSON.stringify(object);

              if (addOrEdit === "EDIT")
                api
                  .patch(
                    `${postOrPatchOrGetOneEndPoint}/${patchingId}`,
                    formData
                  )
                  .then((res) => {
                    toast({
                      variant: "success",
                      title: "Saved",
                      description: JSON.stringify(res.data)
                        .replace(/\{\}/, "")
                        .substring(0, 20),
                    });
                    afterSubmit();
                  })
                  .catch((error) => {
                    toast({
                      variant: "destructive",
                      title: "Not saved",
                      description: error?.response?.data?.message,
                      // .substring(
                      //   0,
                      //   20
                      // )
                    });
                  });
              else
                api
                  .post(postOrPatchOrGetOneEndPoint, formData)
                  .then((res) => {
                    toast({
                      title: "Saved",
                      description: JSON.stringify(res.data).substring(0, 20),
                    });
                    afterSubmit();
                  })
                  .catch((error) => {
                    toast({
                      variant: "destructive",
                      title: "Not saved",
                      description: error?.response?.data?.message,
                      // .substring(
                      //   0,
                      //   20
                      // )
                    });
                  });
            }}
            encType="multipart/form-data"
          >
            <ScrollArea className="h-[calc(100vh_-_13rem)] rounded-md">
              {formFields.map((formField, index) => {
                if (formField.type !== "select") {
                  return (
                    <FormItem
                      key={index}
                      className={`mx-3 ${
                        formField.hidden ? "hidden" : "visible"
                      }`}
                    >
                      <Label htmlFor={formField.name}>
                        {formField.label}{" "}
                        {formField.required ? (
                          <span className="text-red-600">*</span>
                        ) : (
                          ""
                        )}
                      </Label>
                      <Input
                        className="border-blue-400"
                        {...register(formField.name as keyof PatchingItem)}
                        type={formField.type}
                        name={formField.name}
                        id={formField.name}
                        value={formField.value ? formField.value : undefined}
                        required={formField.required}
                      />
                    </FormItem>
                  );
                }
                const key: string = formField.name;
                const item: any = patchingItem;
                const value: string | number | undefined =
                  item?.[key]?.toString();
                return (
                  <FormItem
                    key={index}
                    className={`mx-3 ${
                      formField.hidden ? "hidden" : "visible"
                    }`}
                  >
                    <Label htmlFor={formField.name}>{formField.label}</Label>

                    <ComboBox
                      // name={formField.name as IntrinsicAttributes  }
                      options={formField.options}
                      registerReturn={register(
                        formField.name as keyof PatchingItem
                      )}
                      value={value || undefined}
                    />
                  </FormItem>
                );
              })}
            </ScrollArea>
            <Button className="mt-5 mx-3 w-[calc(100%_-_24px)]" type="submit">
              Submit
            </Button>
            <Button
              className="mt-5 mx-3 w-[calc(100%_-_24px)]"
              variant={"ghost"}
              type="button"
              onClick={() => {
                resetFormFields();
              }}
            >
              Reset
            </Button>
          </form>
        </SheetHeader>
      </SheetContent>
    </Dialog>
  );
}
