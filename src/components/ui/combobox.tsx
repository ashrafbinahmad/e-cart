"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "./input";
import { UseFormRegisterReturn } from "react-hook-form";
import { FormField, FormItem } from "./form";
import Image from "next/image";

type Option = {
  id: number | string;
  name: string;
  icon_src?: string;
};

type PropsType = {
  options: Option[] | undefined;
  registerReturn: UseFormRegisterReturn;
  value: string | number | undefined;
};
export const ComboBox = ({ options, registerReturn, value }: PropsType) => {
  const [open, setOpen] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState<
    Option | undefined
  >(
    options?.find((option) => option.id.toString() === value?.toString()) ||
      undefined
  );
  // const [inputValue, setInputValue] = React.useState<
  //   string | number | undefined
  // >(value);

  React.useEffect(() => {
    // setInputValue()
    setSelectedOption(
      options?.find((option) => option.id.toString() === value) || undefined
    );

    return () => {};
  }, [value, options]);

  return (
    <>
      <Input
        className="hidden"
        {...registerReturn}
        value={options
          ?.find(
            (option) => option.id.toString() === selectedOption?.id.toString()
          )
          ?.id.toString()}
        onChange={(e) =>
          setSelectedOption(
            options?.find((option) => option.id.toString() === e.target.value)
          )
        }
      />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full max-w-[20rem] border-blue-400 overflow-hidden justify-normal">
            {selectedOption ? (
              <>
                <span className="w-5 mr-2">
                  {selectedOption.icon_src ? (
                    <Image
                      width={30}
                      height={30}
                      src={selectedOption.icon_src}
                      alt=""
                    />
                  ) : (
                    ""
                  )}
                </span>
                {selectedOption.name}
              </>
            ) : (
              <>+ Set option</>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <OptionList
            options={options}
            setOpen={setOpen}
            setSelectedOption={setSelectedOption}
          />
        </PopoverContent>
      </Popover>
    </>
  );
};
ComboBox.displayName = "ComboBox";
function OptionList({
  options,
  setOpen,
  setSelectedOption,
}: {
  options: Option[] | undefined;
  setOpen: (open: boolean) => void;
  setSelectedOption: (option: Option | undefined) => void;
}) {
  return (
    <Command className="w-full">
      <CommandInput placeholder="Filter option..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {options?.map((option) => (
            <CommandItem
              style={{ pointerEvents: "auto", opacity: 1 }}
              key={option.id}
              value={option.id.toString()}
              onSelect={(value) => {
                setSelectedOption(
                  options?.find((option) => option.id.toString() === value) ||
                    undefined
                );
                setOpen(false);
              }}
            >
              <span className="w-5 mr-2">
                {option.icon_src ? (
                  <Image width={30} height={30} src={option.icon_src} alt="" />
                ) : (
                  ""
                )}
              </span>
              {option.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
