"use server";
import {
  createAdminClient,
  createSessionClient,
} from "@/lib/appwrite/appwrite";
import { appWriteconfig } from "@/lib/appwrite/env";
import { constructURL, getCategoryFromType, getExtension } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite";
import { getLoggedInUser } from "./auth.action";

export async function uploadFiles({
  files,
  account_Id,
  path,
  owner,
}: UploadFileProps) {
  const databaseId = appWriteconfig.databaseId;
  const bucketId = appWriteconfig.storageBucketId;
  const filesCollectionId = appWriteconfig.fileCollectionId;
  const { storage, database } = await createAdminClient();

  const upLoadInfos = [];

  for (const file of files) {
    let uploadedFile;

    try {
      // 1. Upload to bucket
      uploadedFile = await storage.createFile(bucketId, ID.unique(), file);

      // 2. Generate file preview URL
      const filePreviewUrl = constructURL({ uploadedFile });

      // 3. Prepare metadata
      const fileName = file.name;
      const fileType = getCategoryFromType(file.type);
      const extension = getExtension(file.name);

      // 4. Save metadata in DB
      const uploadInfo = await database.createDocument(
        databaseId,
        filesCollectionId,
        ID.unique(),
        {
          title: fileName,
          url: filePreviewUrl,
          type: fileType,
          bucketFileId: uploadedFile.$id,
          file_extension: extension,
          size: uploadedFile.sizeOriginal,
          shareable_to: [],
          account_id: account_Id,
          owner,
        }
      );

      upLoadInfos.push(uploadInfo);
    } catch (err) {
      // Delete the uploaded file if DB write fails or any other error occurs
      if (uploadedFile?.$id) {
        try {
          await storage.deleteFile(bucketId, uploadedFile.$id);
        } catch (deleteError) {
          console.error("Failed to clean up uploaded file:", deleteError);
        }
      }

      console.error(
        err instanceof Error ? err.message : "Failed to upload file"
      );

      return {
        success: false,
        error: err instanceof Error ? err.message : "Upload failed",
      };
    }
  }

  // All files uploaded successfully
  revalidatePath(path);

  return {
    success: true,
    upLoadInfos,
  };
}

function queryMaker({
  userId,
  email,
  type,
  sort,
  searchedQuery,
  page,
}: {
  userId: string;
  email: string;
  type?: string;
  sort?: string;
  searchedQuery?: string;
  page?: string;
}) {
  const filters = [
    Query.or([
      Query.equal("account_id", userId),
      Query.contains("shareable_to", email),
    ]),
  ];

  if (type === "images") {
    filters.push(Query.equal("type", "image"));
  }

  if (type === "media") {
    filters.push(
      Query.or([Query.equal("type", "video"), Query.equal("type", "song")])
    );
  }

  if (type === "documents") {
    filters.push(Query.equal("type", "pdf"));
  }

  if (type === "others") {
    filters.push(
      Query.and([
        Query.notEqual("type", "image"),
        Query.notEqual("type", "video"),
        Query.notEqual("type", "song"),
        Query.notEqual("type", "pdf"),
      ])
    );
  }

  if (searchedQuery) {
    const uriSearch = decodeURIComponent(searchedQuery);
    filters.push(Query.contains("title", uriSearch));
  }

  const finalQuery: string[] = [Query.and(filters)];

  if (sort) {
    const decodedSort = decodeURIComponent(sort);
    const [sortBy, orderBy] = decodedSort.split("-");
    const sortQuery =
      orderBy === "asc" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy);
    finalQuery.push(sortQuery);
  }

  // ✅ Fix: Pagination logic should go into finalQuery, not filters
  const limit = 25;
  const pageNumber = Number(page) || 1;
  const offset = (pageNumber - 1) * limit;

  finalQuery.push(Query.limit(limit));
  finalQuery.push(Query.offset(offset));

  return finalQuery;
}

export async function getFiles({
  type,
  sort,
  query,
  page,
}: {
  type?: string;
  sort?: string;
  query?: string;
  page?: string;
}) {
  try {
    const client = await createSessionClient();
    if (!client) return null;

    const { account, database } = client;
    const { $id: userId, email } = await account.get();

    const res = await database.listDocuments(
      appWriteconfig.databaseId,
      appWriteconfig.fileCollectionId,
      queryMaker({ userId, email, type, sort, searchedQuery: query, page })
    );
    return res;
  } catch (error) {
    console.error("Failed to fetch files:", error);
    return null;
  }
}

export async function downloadFile(fileId: string) {
  const { storage } = await createAdminClient();
  const bucketId = appWriteconfig.storageBucketId;
  try {
    const fileDownload = await storage.getFileDownload(bucketId, fileId);
    return fileDownload;
  } catch (error) {
    console.error("Download failed:", error);
    return null;
  }
}

export async function renameFile({
  fileId,
  upDatedName,
  path,
  extension,
}: {
  fileId: string;
  upDatedName: string;
  path: string;
  extension: string;
}) {
  try {
    const userInfo = await getLoggedInUser();
    if (!userInfo) throw Error("Please Sign in to rename the file.");

    const { database } = await createAdminClient();

    const fileInfo = await database.listDocuments(
      appWriteconfig.databaseId,
      appWriteconfig.fileCollectionId,
      [Query.equal("$id", fileId), Query.limit(1)]
    );

    if (fileInfo.documents[0].account_id !== userInfo?.userAccount.$id)
      throw Error("You are not allowed to rename the file.");

    await database.updateDocument(
      appWriteconfig.databaseId,
      appWriteconfig.fileCollectionId,
      fileId,
      { title: upDatedName + "." + extension }
    );
    revalidatePath(path);
    return { success: true, message: "File renamed successfully" };
  } catch (error) {
    console.log(error instanceof Error ? error.message : "File Rename Failed");
    return {
      success: false,
      error: error instanceof Error ? error.message : "File Rename Failed",
    };
  }
}

export async function shareFile({
  fileId,
  email,
  path,
}: {
  fileId: string;
  email: string;
  path: string;
}) {
  try {
    const user = await getLoggedInUser();
    const loggedUserId = user?.userDatabase.$id;
    const client = await createSessionClient();
    if (!client) return null;

    const { account, database } = client;
    // Step 1: Get current document
    const document = await database.getDocument(
      appWriteconfig.databaseId,
      appWriteconfig.fileCollectionId,
      fileId
    );
    const OwnerId = document.owner.$id;
    if (loggedUserId !== OwnerId) {
      throw Error("Only Owners are allowed to share file");
    }

    // Step 2: Get current array and append email
    const existingArray = document.shareable_to || [];
    const updatedArray = Array.from(new Set([...existingArray, email]));

    // Step 3: Update the document with the new array
    await database.updateDocument(
      appWriteconfig.databaseId,
      appWriteconfig.fileCollectionId,
      fileId,
      { shareable_to: updatedArray }
    );
    revalidatePath(path);
    return {
      success: true,
      message: "File is now viewable to the shared email.",
    };
  } catch (error) {
    console.log(error instanceof Error ? error.message : "File Sharing Failed");
    return {
      success: false,
      message: error instanceof Error ? error.message : "File Sharing Failed",
    };
  }
}

export async function removeShareFile({
  fileId,
  emailToRemove,
  path,
}: {
  fileId: string;
  emailToRemove: string;
  path: string;
}) {
  try {
    const client = await createSessionClient();
    if (!client) return null;

    const { account, database } = client;
    // Step 1: Get current document
    const document = await database.getDocument(
      appWriteconfig.databaseId,
      appWriteconfig.fileCollectionId,
      fileId
    );

    // Step 2: Get current array and append email
    const existingArray = document.shareable_to;
    const updatedArray = existingArray.filter(
      (item: string) => item !== emailToRemove
    );

    // Step 3: Update the document with the new array
    await database.updateDocument(
      appWriteconfig.databaseId,
      appWriteconfig.fileCollectionId,
      fileId,
      { shareable_to: updatedArray }
    );
    revalidatePath(path);
    return {
      success: true,
      message: "File access removed from the given email.",
    };
  } catch (error) {
    console.log(
      error instanceof Error ? error.message : "File sharing access failed"
    );
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "File sharing access failed",
    };
  }
}

export async function deleteFile({
  fileId,
  bucketFileId,
  path,
}: {
  fileId: string;
  bucketFileId: string;
  path: string;
}) {
  try {
    const client = await createSessionClient();
    if (!client) return null;

    const { account, database } = client;
    await database.deleteDocument(
      appWriteconfig.databaseId,
      appWriteconfig.fileCollectionId,
      fileId
    );
    const { storage } = await createAdminClient();
    await storage.deleteFile(appWriteconfig.storageBucketId, bucketFileId);
    revalidatePath(path);
    return {
      success: true,
      message: "File deleted Successfully",
    };
  } catch (error) {
    console.log(
      error instanceof Error ? error.message : "Failed to delete the file"
    );
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete the file",
    };
  }
}

export async function recentFiles() {
  const client = await createSessionClient();
  if (!client) return null;

  const { account, database } = client;
  const accountId = await getLoggedInUser().then(
    (data) => data?.userAccount.$id
  );
  const res = await database.listDocuments(
    appWriteconfig.databaseId,
    appWriteconfig.fileCollectionId,
    [
      Query.orderDesc("$createdAt"),
      Query.equal("account_id", accountId!),
      Query.limit(10),
    ]
  );

  return res.documents;
}

export async function storageStatistic() {
  const client = await createSessionClient();
  if (!client) return null;

  const { account, database } = client;
  const user = await getLoggedInUser();
  const { userAccount } = user!;
  const userAccountId = userAccount.$id;

  try {
    const result = {
      images: 0,
      videos: 0,
      audio: 0,
      documents: 0,
      others: 0,
      total: 0,
    };

    const limit = 100;
    let offset = 0;

    while (true) {
      const data = await database.listDocuments(
        appWriteconfig.databaseId,
        appWriteconfig.fileCollectionId,
        [
          Query.equal("account_id", userAccountId),
          Query.limit(limit),
          Query.offset(offset),
        ]
      );

      for (const item of data.documents) {
        const sizeMB = item.size / (1024 * 1024);

        switch (item.type) {
          case "image":
            result.images += sizeMB;
            break;
          case "video":
            result.videos += sizeMB;
            break;
          case "song":
            result.audio += sizeMB;
            break;
          case "pdf":
          case "document":
            result.documents += sizeMB;
            break;
          default:
            result.others += sizeMB;
            break;
        }

        result.total += sizeMB;
      }

      // Break if less than a full page was returned
      if (data.documents.length < limit) {
        break;
      }

      offset += limit;
    }

    return {
      success: true,
      usedMB: {
        images: result.images.toFixed(2),
        videos: result.videos.toFixed(2),
        audio: result.audio.toFixed(2),
        documents: result.documents.toFixed(2),
        others: result.others.toFixed(2),
        total: result.total.toFixed(2),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "failed to fetch storage stats",
    };
  }
}
