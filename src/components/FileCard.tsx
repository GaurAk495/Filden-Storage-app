import { formatDate, formatFileSize } from "@/lib/utils";
import { Models } from "node-appwrite";
import React from "react";
import Thumbnail from "./Thumbnail";
import FileCardMenu from "./FileCardMenu";
import Link from "next/link";

function FileCard({ file }: { file: Models.Document }) {
  return (
    <>
      <div className="group relative w-full rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all duration-300 hover:shadow-lg overflow-hidden">
        {/* Image Preview with Menu Button on Top-Right */}
        <div className="relative w-full aspect-square bg-slate-50 overflow-hidden">
          <Link href={file.url} target="_blank">
            <Thumbnail file={file} size={100} />
          </Link>
          {/* Menu Button Top Right */}
          <div className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/80 hover:bg-white shadow transition-colors">
            <FileCardMenu file={file} />
          </div>
        </div>
        {/* File Info */}
        <div className="p-4 space-y-1 text-slate-700 text-sm">
          <div className="text-xs text-slate-500">
            {formatFileSize(file.size)}
          </div>
          <div className="font-medium truncate">{file.title}</div>
          <div className="text-xs text-slate-500">
            {formatDate(file.$createdAt)}
          </div>
          <div className="text-[10px] text-slate-600">
            By: {file.owner.Full_Name}
          </div>
        </div>
      </div>
    </>
  );
}

export default FileCard;
