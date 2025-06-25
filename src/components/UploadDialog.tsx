import React, { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FileUpload from "./FileUpload";

function UploadDialog({
  open,
  setOpen,
  account_Id,
  owner,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  account_Id: string;
  owner: string;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm w-full sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-800">
            Upload Files
          </DialogTitle>
          <DialogDescription className="mb-4">
            Drag & drop files below, or click to select.
          </DialogDescription>
        </DialogHeader>
        <FileUpload account_Id={account_Id} setOpen={setOpen} owner={owner} />
      </DialogContent>
    </Dialog>
  );
}

export default UploadDialog;
