import { Boxes, FileText, Image, LayoutDashboard, Video } from "lucide-react";

export const navItems = [
  {
    name: "Dashboard",
    Icon: LayoutDashboard,
    url: "/",
  },
  {
    name: "Documents",
    Icon: FileText,
    url: "/documents",
  },
  {
    name: "Images",
    Icon: Image,
    url: "/images",
  },
  {
    name: "Media",
    Icon: Video,
    url: "/media",
  },
  {
    name: "Others",
    Icon: Boxes,
    url: "/others",
  },
];

export const actionsDropdownItems = [
  {
    label: "Rename",
    icon: "/assets/icons/edit.svg",
    value: "rename",
  },
  {
    label: "Details",
    icon: "/assets/icons/info.svg",
    value: "details",
  },
  {
    label: "Share",
    icon: "/assets/icons/share.svg",
    value: "share",
  },
  {
    label: "Download",
    icon: "/assets/icons/download.svg",
    value: "download",
  },
  {
    label: "Delete",
    icon: "/assets/icons/delete.svg",
    value: "delete",
  },
];

export const sortTypes = [
  {
    label: "Date created (newest)",
    value: "$createdAt-desc",
  },
  {
    label: "Created Date (oldest)",
    value: "$createdAt-asc",
  },
  {
    label: "Name (A-Z)",
    value: "title-asc",
  },
  {
    label: "Name (Z-A)",
    value: "title-desc",
  },
  {
    label: "Size (Highest)",
    value: "size-desc",
  },
  {
    label: "Size (Lowest)",
    value: "size-asc",
  },
];

export const MAX_FILE_SIZE = 50 * 1024 * 1024;

export const imagePlaceHolder =
  "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";
