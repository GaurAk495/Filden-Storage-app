import Thumbnail from "./Thumbnail";
import { formatDate, formatFileSize } from "@/lib/utils";
import { Models } from "node-appwrite";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { CircleX, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import {
  deleteFile,
  removeShareFile,
  renameFile,
  shareFile,
} from "@/action/fileStorage.action";

export function DetailAction({ file }: { file: Models.Document }) {
  return (
    <div className="p-2 mt-2 w-full">
      <div className="grid grid-cols-[50px_1fr] gap-5 border shadow p-2 rounded-2xl">
        {/* Image Preview */}
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-100 flex justify-center items-center">
          <Thumbnail file={file} size={40} />
        </div>

        {/* File Details */}
        <div className="overflow-hidden w-full flex flex-col justify-evenly">
          <p className="font-semibold truncate line-clamp-1 text-sm">
            {file.title}
          </p>
          <p className="text-xs text-slate-400">
            {formatDate(file.$createdAt)}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <table>
          <tbody className="flex flex-col gap-4">
            <tr>
              <th className="w-20 text-left text-slate-700 font-thin text-sm">
                Format
              </th>
              <td> {file.type} </td>
            </tr>
            <tr>
              <th className="w-20 text-left text-slate-700 font-thin text-sm">
                Owner
              </th>
              <td> {file.owner.Full_Name} </td>
            </tr>
            <tr>
              <th className="w-20 text-left text-slate-700 font-thin text-sm">
                Size
              </th>
              <td> {formatFileSize(file.size)} </td>
            </tr>
            <tr>
              <th className="w-20 text-left text-slate-700 font-thin text-sm">
                Last Edit
              </th>
              <td> {formatDate(file.$updatedAt)} </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function RenameAction({
  file,
  handleonDialogClose,
  action,
}: {
  file: Models.Document;
  handleonDialogClose: () => void;
  action: ActionType;
}) {
  const [isPending, setIsPending] = useState(false);
  const [rename, setRename] = useState(file.title);
  const path = usePathname();
  const router = useRouter();

  const handleOnAction = async () => {
    try {
      setIsPending(true);
      if (!action) return toast.error("No action selected");

      if (action === "rename" && (!rename || rename.trim() === ""))
        return toast.error("File name cannot be empty");

      const { success, error, message } = await renameFile({
        fileId: file.$id,
        upDatedName: rename.trim(),
        extension: file.file_extension,
        path,
      });

      if (success) {
        handleonDialogClose();
        toast.success(message || "Action completed successfully");
        router.refresh();
      } else {
        toast.error(error || "Operation failed");
      }
    } catch (err) {
      console.error("Action error:", err);
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <Input
        type="text"
        value={rename}
        onChange={(e) => setRename(e.target.value)}
        placeholder="rename file"
        className="mt-4"
      />
      <div className="flex flex-col sm:flex-row gap-2 justify-center items-stretch sm:justify-between mt-2">
        <Button
          className="bg-slate-200 text-black hover:bg-slate-300 hover:text-black cursor-pointer p-6 rounded-3xl"
          onClick={handleonDialogClose}
        >
          Cancel
        </Button>
        <Button
          onClick={handleOnAction}
          disabled={isPending}
          className="bg-red-400 p-6 rounded-3xl cursor-pointer hover:bg-red-500"
        >
          Rename
          {isPending && <Loader2 className="animate-spin" />}
        </Button>
      </div>
    </>
  );
}

export function ShareAction({
  file,
  handleonDialogClose,
}: {
  file: Models.Document;
  handleonDialogClose: () => void;
}) {
  const [pending, setPending] = useState(false);
  const [email, setEmail] = useState("");
  const path = usePathname();
  const router = useRouter();
  const handleOnShare = async () => {
    setPending(true);
    if (!email) return toast.error("Email can't be empty");
    const { message, success } = await shareFile({
      fileId: file.$id,
      email,
      path,
    });
    handleonDialogClose();
    setPending(false);
    router.refresh();
    if (!success) return toast.error(message);
    toast.success(message);
  };

  const removeFromShare = async (emailToRemove: string) => {
    setPending(true);
    const { message, success } = await removeShareFile({
      fileId: file.$id,
      emailToRemove,
      path,
    });
    handleonDialogClose();
    setPending(false);
    router.refresh();
    if (!success) return toast.error(message);
    toast.success(message);
  };

  return (
    <>
      <div className="grid grid-cols-[50px_1fr] gap-5 border shadow p-2 rounded-2xl">
        {/* Image Preview */}
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-100 flex justify-center items-center">
          <Thumbnail file={file} size={40} />
        </div>

        {/* File Details */}
        <div className="overflow-hidden w-full flex flex-col justify-evenly">
          <p className="font-semibold truncate line-clamp-1 text-sm">
            {file.title}
          </p>
          <p className="text-xs text-slate-400">
            {formatDate(file.$createdAt)}
          </p>
        </div>
      </div>
      <p className="text-slate-800 text-sm text-center">
        Share file with other users
      </p>
      <Input
        type="email"
        placeholder="Enter email address"
        className="border-2 shadow text-slate-600 text-sm"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="flex justify-between">
        <p className="text-slate-800 text-sm">shared with</p>
        <p className="text-slate-800 text-sm">
          {file.shareable_to.length} users
        </p>
      </div>
      <div>
        {file.shareable_to.map((item: string) => (
          <div className="flex justify-between items-center" key={item}>
            <p className="text-slate-800 text-sm">{item}</p>
            <Button
              className="bg-background hover:bg-background cursor-pointer"
              onClick={() => removeFromShare(item)}
            >
              <CircleX className="text-red-600" />
            </Button>
          </div>
        ))}
        {file.shareable_to.length === 0 && (
          <p className="text-slate-800 text-sm text-center p-5 shadow border-2 rounded-2xl">
            File is not shared to anyone
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-2 justify-center items-stretch sm:justify-between mt-2">
          <Button
            className="bg-slate-200 text-black hover:bg-slate-300 hover:text-black cursor-pointer p-6 rounded-3xl"
            onClick={handleonDialogClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleOnShare}
            disabled={pending}
            className="bg-red-400 p-6 rounded-3xl cursor-pointer hover:bg-red-500"
          >
            share
            {pending && <Loader2 className="animate-spin" />}
          </Button>
        </div>
      </div>
    </>
  );
}

export function DeleteAction({
  file,
  handleonDialogClose,
}: {
  file: Models.Document;
  handleonDialogClose: () => void;
}) {
  const [pending, setPending] = useState(false);
  const path = usePathname();
  const router = useRouter();

  const handleOnDelete = async () => {
    setPending(true);
    const { message, success } = await deleteFile({
      fileId: file.$id,
      bucketFileId: file.bucketFileId,
      path,
    });
    handleonDialogClose();
    setPending(false);
    router.refresh();
    if (!success) return toast.error(message);
    toast.success(message);
  };
  return (
    <div>
      <p className="text-center text-slate-700">Are you sure to Delete?</p>
      <p className="text-center text-red-400">{file.title}</p>
      <div className="flex flex-col sm:flex-row gap-2 justify-center items-stretch sm:justify-between mt-2">
        <Button
          className="bg-slate-200 text-black hover:bg-slate-300 hover:text-black cursor-pointer p-4 rounded-3xl"
          onClick={handleonDialogClose}
        >
          Cancel
        </Button>
        <Button
          onClick={handleOnDelete}
          disabled={pending}
          className="bg-red-400 p-4 rounded-3xl cursor-pointer hover:bg-red-500"
        >
          Delete
          {pending && <Loader2 className="animate-spin" />}
        </Button>
      </div>
    </div>
  );
}
