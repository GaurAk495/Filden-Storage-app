import { clsx, type ClassValue } from "clsx";
import {
  FileArchiveIcon,
  FileAudioIcon,
  FileCodeIcon,
  FileIcon,
  FileJsonIcon,
  FileSpreadsheetIcon,
  FileText,
  FileTextIcon,
  FileVideoIcon,
  ImageIcon,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import { appWriteconfig } from "./appwrite/env";
import { Models } from "node-appwrite";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getExtension(filename: string) {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop() : "";
}

const extensionMap: Record<string, React.ElementType> = {
  // Images
  jpg: ImageIcon,
  jpeg: ImageIcon,
  png: ImageIcon,
  gif: ImageIcon,
  bmp: ImageIcon,
  webp: ImageIcon,
  svg: ImageIcon,

  // Text
  txt: FileTextIcon,
  md: FileTextIcon,
  rtf: FileTextIcon,

  // Spreadsheets
  xls: FileSpreadsheetIcon,
  xlsx: FileSpreadsheetIcon,
  csv: FileSpreadsheetIcon,

  // Video
  mp4: FileVideoIcon,
  mkv: FileVideoIcon,
  mov: FileVideoIcon,
  webm: FileVideoIcon,

  // Audio
  mp3: FileAudioIcon,
  wav: FileAudioIcon,
  ogg: FileAudioIcon,
  flac: FileAudioIcon,

  // Archives
  zip: FileArchiveIcon,
  rar: FileArchiveIcon,
  "7z": FileArchiveIcon,
  tar: FileArchiveIcon,
  gz: FileArchiveIcon,

  // Code
  js: FileCodeIcon,
  ts: FileCodeIcon,
  jsx: FileCodeIcon,
  tsx: FileCodeIcon,
  html: FileCodeIcon,
  css: FileCodeIcon,

  // JSON
  json: FileJsonIcon,

  // PDF
  pdf: FileText,
};

export function getIcon(extension: string): React.ElementType {
  return extensionMap[extension.toLowerCase()] || FileIcon;
}

export function getCategoryFromType(type: string): string {
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type === "application/pdf") return "pdf";
  if (type.startsWith("audio/")) return "song";
  if (
    type === "text/plain" ||
    type === "application/msword" ||
    type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    type === "application/vnd.ms-excel" ||
    type === "application/json"
  )
    return "document";

  return "other";
}

export function constructURL({ uploadedFile }: { uploadedFile: Models.File }) {
  return `${appWriteconfig.endpointId}/storage/buckets/${appWriteconfig.storageBucketId}/files/${uploadedFile.$id}/view?project=${appWriteconfig.projectId}`;
}

export function formatFileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(1)} ${units[i]}`;
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function totalSizeinSpace(data: Models.Document[]) {
  const totalSize = data
    .map((item) => item.size)
    .reduce((acc, current) => acc + current, 0);

  return formatFileSize(totalSize);
}

export function urlmaker(title: string, type: string) {
  if (type === "image") return `/images?query=${title}`;
  if (type === "video") return `/media?query=${title}`;
  if (type === "song") return `/media?query=${title}`;
  if (type === "pdf") return `/documents?query=${title}`;
  return `/others?${title}`;
}

export const categories: {
  label: string;
  key: CategoryKey;
  color: string;
  icon: string;
}[] = [
  { label: "Images", key: "images", color: "bg-blue-100", icon: "🖼️" },
  { label: "Videos", key: "videos", color: "bg-red-100", icon: "🎬" },
  { label: "Audio", key: "audio", color: "bg-green-100", icon: "🎧" },
  { label: "Documents", key: "documents", color: "bg-yellow-100", icon: "📄" },
  { label: "Others", key: "others", color: "bg-gray-200", icon: "📦" },
];
