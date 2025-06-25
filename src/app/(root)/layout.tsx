import { getLoggedInUser } from "@/action/auth.action";
import Header from "@/components/Header";
import MobileSideBar from "@/components/MobileSideBar";
import SideBar from "@/components/SideBar";
import StoreWrapper from "@/store/StoreWrapper";
import { redirect } from "next/navigation";
import React from "react";

async function layout({ children }: { children: React.ReactNode }) {
  const res = await getLoggedInUser();
  if (!res) redirect("/sign-in");
  const { userAccount, userDatabase } = res;
  const { Full_Name, Email, Avatar, $id: ownerId } = userDatabase;
  const user = {
    Full_Name,
    Email,
    Avatar,
    ownerId,
    accountId: userAccount.$id,
  };
  return (
    <StoreWrapper user={user}>
      <div className="flex flex-row h-screen">
        <SideBar name={Full_Name} email={Email} avatar={Avatar} />
        <section className="flex flex-col w-full h-screen">
          <Header ownerId={ownerId} accountId={userAccount.$id} />
          <MobileSideBar
            name={Full_Name}
            email={Email}
            avatar={Avatar}
            ownerId={ownerId}
            accountId={userAccount.$id}
          />
          <main className="text-black bg-white pr-6">{children}</main>
        </section>
      </div>
    </StoreWrapper>
  );
}

export default layout;
