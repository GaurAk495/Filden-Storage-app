"use server";
import {
  createAdminClient,
  createSessionClient,
} from "@/lib/appwrite/appwrite";
import { appWriteconfig } from "@/lib/appwrite/env";
import { parseStringfy } from "@/lib/parse";
import { ID, Query } from "appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const getUserByEmail = async (email: string) => {
  const { database } = await createAdminClient();
  const res = await database.listDocuments(
    appWriteconfig.databaseId,
    appWriteconfig.userCollectionId,
    [Query.equal("Email", email), Query.limit(1)]
  );

  return res.total > 0 ? true : false;
};

export const sendOTPemail = async (email: string) => {
  const { account } = await createAdminClient();
  try {
    const accountDetail = await account.createEmailToken(ID.unique(), email);
    return accountDetail.userId;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      throw Error(error.message);
    }
  }
};

export const createAccount = async ({
  fullname,
  email,
}: {
  fullname: string;
  email: string;
}) => {
  const isAccountAlreadyExist = await getUserByEmail(email);
  const accountId = await sendOTPemail(email);

  if (!accountId) throw Error("Failed To Sent OTP");
  if (!isAccountAlreadyExist) {
    const { database } = await createAdminClient();

    database.createDocument(
      appWriteconfig.databaseId,
      appWriteconfig.userCollectionId,
      "unique()",
      {
        Full_Name: fullname,
        Email: email,
        Avatar:
          "https://img.freepik.com/free-psd/3d-illustration-person-with-rainbow-sunglasses_23-2149436196.jpg",
        Account_id: accountId,
      }
    );
  }
  return parseStringfy({ accountId });
};

export const otpVerification = async ({
  accountId,
  otp,
}: {
  accountId: string;
  otp: string;
}) => {
  const cookieStore = await cookies();
  const { account } = await createAdminClient();
  try {
    const session = await account.createSession(accountId, otp);
    cookieStore.set("fileDen", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    });
  } catch (error) {
    console.log(error instanceof Error ? error.message : "Unknow Error");
    throw Error(error instanceof Error ? error.message : "Unknow Error");
  }

  redirect("/");
};

export async function getLoggedInUser() {
  try {
    const client = await createSessionClient();
    if (!client) return null;

    const { account, database } = client;

    const userAccount = await account.get();
    const response = await database.listDocuments(
      appWriteconfig.databaseId,
      appWriteconfig.userCollectionId,
      [Query.equal("Account_id", userAccount.$id)]
    );

    const userDatabase = response.documents[0] || null;
    return { userAccount, userDatabase };
  } catch (error) {
    console.error("Failed to get logged-in user:", error);
    return null;
  }
}

export async function signOut() {
  const client = await createSessionClient();
  if (!client) return null;

  const { account } = client;
  (await cookies()).delete("fileDen");
  await account.deleteSession("current");
  redirect("/sign-in");
}

export async function login({ email }: { email: string }) {
  try {
    const existingUser = await getUserByEmail(email);
    if (!existingUser) throw Error("User Doesn't exist please Sign Up first");
    const accountId = await sendOTPemail(email);
    return parseStringfy({ accountId });
  } catch (error) {
    console.log(error instanceof Error ? error.message : "Login error");
    throw Error(error instanceof Error ? error.message : "Login error");
  }
}
