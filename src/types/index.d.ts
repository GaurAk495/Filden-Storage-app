declare type UploadFileProps = {
  files: File[];
  account_Id: string;
  path: string;
  owner: string;
};

declare type userAccountInfo = {
  email?: string;
  Full_Name?: string;
  Avatar?: string;
  Account_id?: string;
  userId: string;
};

declare interface FileCardProps {
  title: string;
  url: string;
  type: "image" | "video" | "pdf" | "song" | "document" | "other";
  bucketFileId: string;
  account_id: string;
  file_extension: string;
  size: number;
  shareable_to: string[];
}

declare type ActionType = "rename" | "details" | "share" | "delete";

type ActionHandlers = {
  [K in ActionType]: () => Promise<{
    success: boolean;
    error?: string;
    message?: string;
  }>;
};

type CategoryKey = "images" | "videos" | "audio" | "documents" | "others";

declare interface User {
  Full_Name: string;
  Email: string;
  Avatar: string;
  ownerId: string;
  accountId: string;
}
