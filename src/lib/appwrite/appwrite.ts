"use server";

import { Client, Account, Databases, Storage, Avatars } from "node-appwrite";
import { appWriteconfig } from "./env";
import { cookies } from "next/headers";

export const createSessionClient = async () => {
  const client = new Client()
    .setEndpoint(appWriteconfig.endpointId)
    .setProject(appWriteconfig.projectId);

  const session = (await cookies()).get("fileDen");

  if (!session?.value) {
    console.warn("Session not found");
    return null;
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get database() {
      return new Databases(client);
    },
  };
};

export const createAdminClient = async () => {
  const client = new Client()
    .setEndpoint(appWriteconfig.endpointId)
    .setProject(appWriteconfig.projectId)
    .setKey(appWriteconfig.adminKey);

  return {
    get account() {
      return new Account(client);
    },
    get database() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
    get avatars() {
      return new Avatars(client);
    },
  };
};
