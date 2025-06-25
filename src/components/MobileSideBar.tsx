"use client";
import { imagePlaceHolder, navItems } from "@/constants";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "./ui/separator";
import { FileBox } from "lucide-react";
import { signOut } from "@/action/auth.action";
import { useState } from "react";
import UploadDialog from "./UploadDialog";

function MobileSideBar({
  name,
  email,
  avatar,
  ownerId,
  accountId,
}: {
  name: string;
  email: string;
  avatar: string;
  ownerId: string;
  accountId: string;
}) {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOnUpload = () => {
    setSheetOpen(false);
    setOpen(true);
  };
  return (
    <div className="block sm:hidden">
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <div className="flex justify-between px-4 py-2">
          <Image
            src="/assets/icons/logo-full-brand.svg"
            alt="logo"
            width={100}
            height={40}
            className=""
          />
          <SheetTrigger className="text-black">
            <Image
              src="/assets/icons/menu.svg"
              alt="menu-icon"
              width={30}
              height={30}
              className="h-full"
            />
          </SheetTrigger>
        </div>
        <SheetContent className="w-[300px] p-4 sm:hidden">
          <div className="flex items-center gap-3 bg-pink-100 p-3 rounded-2xl shadow-sm mt-10">
            <Image
              src={String(avatar)}
              alt="User"
              width={40}
              height={40}
              className="rounded-full object-cover border border-pink-300"
            />
            <div>
              <p className="font-semibold text-gray-800 text-[14px]">{name}</p>
              <p className="text-gray-600 text-[12px]">{email}</p>
            </div>
          </div>
          <Separator className="my-2  border rounded-4xl" />
          <ul className="space-y-2">
            {navItems.map(({ name, icon, url }) => {
              const isActive = pathname === url;
              return (
                <li
                  key={name}
                  className={cn(
                    "rounded-xl transition-colors",
                    isActive ? "bg-red-500 shadow-md" : "hover:bg-red-100 "
                  )}
                >
                  <Link
                    href={url}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 font-medium"
                    )}
                  >
                    <Image
                      src={icon}
                      alt={name}
                      width={24}
                      height={24}
                      className={cn(
                        "object-contain",
                        isActive
                          ? "filter invert brightness-0"
                          : "fill-amber-900"
                      )}
                    />
                    <SheetTitle
                      className={isActive ? "text-white" : "text-gray-700"}
                    >
                      {name}
                    </SheetTitle>
                    <SheetDescription></SheetDescription>
                  </Link>
                </li>
              );
            })}
          </ul>
          <Separator className="my-2 border rounded-4xl" />
          <button
            className="text-slate-800 text-center flex justify-center items-center gap-2 bg-pink-200
          p-3 rounded-2xl cursor-pointer"
            onClick={handleOnUpload}
          >
            <FileBox /> FIle Upload
          </button>
          <button
            className="flex p-3 w-full rounded-2xl bg-red-400 gap-2 justify-center items-center cursor-pointer"
            onClick={signOut}
          >
            <Image
              src="/assets/icons/logout.svg"
              alt="logout-svg"
              width={24}
              height={24}
            />
            <span className="text-white">Logout</span>
          </button>
        </SheetContent>
      </Sheet>
      <UploadDialog
        open={open}
        setOpen={setOpen}
        account_Id={accountId}
        owner={ownerId}
      />
    </div>
  );
}

export default MobileSideBar;
