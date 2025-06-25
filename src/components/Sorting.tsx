"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { sortTypes } from "@/constants";
import { LayoutGrid, Menu } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function Sorting() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`);
  };
  return (
    <>
      <Select
        defaultValue={sortTypes[0].value}
        onValueChange={handleSortChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue
            placeholder={sortTypes[0].label}
            className="text-black"
          />
        </SelectTrigger>
        <SelectContent className="">
          {sortTypes.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="p-2 rounded-3xl bg-red-400">
        <Menu color="white" size={18} />
      </div>
      <div className="p-2 rounded-3xl bg-red-400">
        <LayoutGrid color="white" size={18} />
      </div>
    </>
  );
}

export default Sorting;
