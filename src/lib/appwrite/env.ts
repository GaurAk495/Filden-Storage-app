export const appWriteconfig = {
  adminKey: String(process.env.NEXT_APPWRITE_KEY),
  endpointId: String(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT),
  projectId: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
  databaseId: String(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID),
  userCollectionId: String(process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION),
  fileCollectionId: String(process.env.NEXT_PUBLIC_APPWRITE_Files_COLLECTION),
  storageBucketId: String(process.env.NEXT_PUBLIC_APPWRITE_BUCKET),
};
