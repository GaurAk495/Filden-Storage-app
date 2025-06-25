"use client";
import { downloadFile } from "@/action/fileStorage.action";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { actionsDropdownItems } from "@/constants";
import { Menu } from "lucide-react";
import Image from "next/image";
import { Models } from "node-appwrite";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useState } from "react";
import {
  DeleteAction,
  DetailAction,
  RenameAction,
  ShareAction,
} from "./ActionDialogueMenuItems";
import { useUserStore } from "@/store/userStore";

function FileCardMenu({ file }: { file: Models.Document }) {
  const [action, setAction] = useState<ActionType>();
  const [dialogOpen, setDialogOpen] = useState(false);

  const user = useUserStore((state) => state.user);
  const loggedInUserEmail = user?.Email;
  const FileOwner = file.owner.Email;

  const isUserOwner = loggedInUserEmail === FileOwner;

  const handleOnDownload = async () => {
    const fileDownloadUrl = await downloadFile(file.bucketFileId);
    if (!fileDownloadUrl) return toast.error("File downlaoding error");
    const blob = new Blob([fileDownloadUrl]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.title;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleonDialogClose = () => {
    setDialogOpen(false);
  };

  const renderDialog = () => {
    return (
      <>
        <DialogHeader>
          <DialogTitle className="text-center">
            {action && action?.[0].toUpperCase() + action?.slice(1)}
          </DialogTitle>
        </DialogHeader>
        {action === "details" && <DetailAction file={file} />}
        {action == "rename" && (
          <RenameAction
            file={file}
            action={action}
            handleonDialogClose={handleonDialogClose}
          />
        )}
        {action == "share" && (
          <ShareAction file={file} handleonDialogClose={handleonDialogClose} />
        )}
        {action == "delete" && (
          <DeleteAction file={file} handleonDialogClose={handleonDialogClose} />
        )}
      </>
    );
  };
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer" asChild>
          <Menu size={16} className="text-slate-600" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-w-[150px] w-full">
          <DropdownMenuItem>
            <p className="truncate text-sm">{file.title}</p>
          </DropdownMenuItem>
          {actionsDropdownItems.map((item) => {
            // Always allow Download
            if (item.label === "Download") {
              return (
                <DropdownMenuItem key={item.value} onClick={handleOnDownload}>
                  <Image
                    src={item.icon}
                    width={20}
                    height={20}
                    alt={item.label}
                  />
                  {item.label}
                </DropdownMenuItem>
              );
            }

            // If user is not the owner, only allow "Details"
            if (!isUserOwner && item.label !== "Details") {
              return null;
            }

            // For all other items (including "Details" for non-owner and all for owner)
            return (
              <DropdownMenuItem
                className="w-full"
                asChild
                key={item.value}
                onClick={() => setAction(item.value as ActionType)}
              >
                <DialogTrigger>
                  <Image
                    src={item.icon}
                    width={28}
                    height={28}
                    alt={item.label}
                  />
                  {item.label}
                </DialogTrigger>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent
        className="w-full rounded-3xl"
        style={{ maxWidth: "400px" }}
      >
        {renderDialog()}
      </DialogContent>
    </Dialog>
  );
}

export default FileCardMenu;
