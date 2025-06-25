"use client";
import { LogOut, UploadCloud } from "lucide-react";
import { Button } from "./ui/button";
import { signOut } from "@/action/auth.action";
import { useState } from "react";
import UploadDialog from "./UploadDialog";
import HeaderSearch from "./HeaderSearch";

function Header({
  ownerId,
  accountId,
}: {
  ownerId: string;
  accountId: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white min-h-16 hidden sm:flex justify-between items-center px-8 py-3  rounded-r-2xl">
      {/* Search Bar */}
      <HeaderSearch />
      {/* File Upload & Logout Buttons */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          className="gap-2 rounded-xl hover:bg-pink-500 bg-pink-400 text-white hover:text-white"
          onClick={() => setOpen(true)}
        >
          <UploadCloud className="h-5 w-5" />
          Upload
        </Button>

        <div className="bg-red-50 p-2 rounded-full">
          <LogOut
            color="red"
            className="h-5 w-5 cursor-pointer"
            onClick={signOut}
          />
        </div>
      </div>
      <UploadDialog
        open={open}
        setOpen={setOpen}
        owner={ownerId}
        account_Id={accountId}
      />
    </header>
  );
}

export default Header;
