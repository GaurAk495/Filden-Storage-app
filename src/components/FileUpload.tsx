"use client";
import { getExtension, getIcon } from "@/lib/utils";
import { FileIcon, Trash2 } from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { uploadFiles } from "@/action/fileStorage.action";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import UploadToast from "./UploadToast";

function FileUpload({
  account_Id,
  setOpen,
  owner,
}: {
  account_Id: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  owner: string;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ [key: string]: string }>({});
  const path = usePathname();
  const router = useRouter();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => {
      const names = new Set(prev.map((f) => f.name));
      return [...prev, ...acceptedFiles.filter((f) => !names.has(f.name))];
    });
  }, []);

  const removeFile = (fileName: string) => {
    setFiles((prev) => prev.filter((file) => file.name !== fileName));
    setPreviews((prev) => {
      const updated = { ...prev };
      delete updated[fileName];
      return updated;
    });
  };

  useEffect(() => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    const newPreviews: { [key: string]: string } = {};
    imageFiles.forEach((file) => {
      newPreviews[file.name] = URL.createObjectURL(file);
    });

    setPreviews(newPreviews);

    // Cleanup URLs
    return () => {
      Object.values(newPreviews).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const handleOnUpload = async () => {
    setOpen(false);

    // Step 1: Show fake upload toasts
    const toasts = files.map((file) => {
      const id = toast.custom((t) => <UploadToast file={file} />, {
        duration: Infinity,
      });
      return { id };
    });

    try {
      const { success, error } = await uploadFiles({
        files,
        account_Id,
        path,
        owner,
      });

      // Step 2: Dismiss all progress toasts
      toasts.forEach(({ id }) => toast.dismiss(id));

      if (!success) {
        return toast.error(error);
      }

      // Step 3: Show success toast
      toast.success("Files uploaded successfully!");
      router.refresh();
    } catch (error) {
      toasts.forEach(({ id }) => toast.dismiss(id));
      toast.error(error instanceof Error ? error.message : "Uploading failed");
    }
  };

  return (
    <>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors duration-200
            ${
              isDragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
            }`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-500 text-sm">
          {isDragActive
            ? "Drop the files here..."
            : "Drag & drop files here, or click to browse"}
        </p>
      </div>

      {/* File Preview */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Selected files:</h4>
          <ul className="grid grid-cols-1 gap-3 max-h-45 overflow-y-auto">
            {files.map((file, index) => {
              const isImage = file.type.startsWith("image/");
              const previewUrl = previews[file.name];
              const extension = getExtension(file.name);
              const Icon = extension ? getIcon(extension) : FileIcon;
              return (
                <li
                  key={index}
                  className="flex items-center gap-4 p-2 bg-gray-100 rounded-lg shadow-sm relative w-full"
                >
                  {/* Thumbnail or Icon */}
                  {isImage ? (
                    <img
                      src={previewUrl}
                      alt={file.name}
                      className="w-14 h-14 object-cover rounded-md border"
                    />
                  ) : (
                    <div className="w-14 h-14 flex items-center justify-center bg-white border rounded-md">
                      <Icon className="text-red-400" size={30} />
                    </div>
                  )}

                  {/* File info */}
                  <div className="flex-1 w-1/4">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>

                  {/* Remove button */}
                  <div className="flex gap-2 items-center">
                    <Trash2
                      size={30}
                      className="p-2 rounded-full  text-white cursor-pointer bg-red-500 hover:bg-red-600"
                      onClick={() => removeFile(file.name)}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
          <Button
            className="w-full bg-red-400 hover:bg-red-500 cursor-pointer"
            onClick={handleOnUpload}
          >
            Upload
          </Button>
        </div>
      )}
    </>
  );
}

export default FileUpload;
