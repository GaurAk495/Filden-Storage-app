import { getExtension, getIcon } from "@/lib/utils";
import { FileIcon } from "lucide-react";
import Image from "next/image";
import { Models } from "node-appwrite";

function Thumbnail({ file, size }: { file: Models.Document; size: number }) {
  const fileExtension = file.file_extension;
  const fileType = file.type;
  const Icon = getIcon(fileExtension);
  return fileType == "image" ? (
    <Image
      src={file.url}
      alt={file.title}
      width={400}
      height={400}
      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
    />
  ) : (
    <Icon
      size={size}
      className="mx-auto h-full text-red-400 transition-transform duration-300 group-hover:scale-105 bg-center"
    />
  );
}

export default Thumbnail;

export function UploadToastThumbanil({ file }: { file: File }) {
  const isImage = file.type.startsWith("image/");
  const previewUrl = URL.createObjectURL(file);
  const extension = getExtension(file.name);
  const Icon = extension ? getIcon(extension) : FileIcon;
  return isImage ? (
    <Image
      src={previewUrl}
      alt={file.name}
      sizes="30"
      className="w-14 h-14 object-cover rounded-md border"
    />
  ) : (
    <div className="w-14 h-14 flex items-center justify-center bg-white border rounded-md">
      <Icon className="text-red-400" size={30} />
    </div>
  );
}
