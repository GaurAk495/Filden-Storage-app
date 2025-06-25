import { getLoggedInUser } from "@/action/auth.action";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

async function layout({ children }: { children: React.ReactNode }) {
  let user = null;
  try {
    user = await getLoggedInUser();
  } catch (err) {
    console.log("Failed in layout.tsx:", err);
  }
  if (user) {
    redirect("/");
  }
  return (
    <div className="flex flex-col sm:flex-row min-h-screen">
      {/* Left Section */}
      <section className="hidden sm:flex flex-col w-full md:max-w-sm bg-[#fa7275] py-12 px-6 sm:px-16 gap-8 shadow-sm sm:shadow-none border-b sm:border-b-0 sm:border-r border-gray-200 text-white ">
        <Image
          src="/assets/icons/logo-full.svg"
          alt="Logo"
          width={200}
          height={120}
          className="w-auto h-auto"
        />

        {/* Text Section - Only on Desktop */}
        <div className="space-y-4 hidden sm:block">
          <h1 className="text-3xl sm:text-4xl font-bold">
            Manage your files the best way
          </h1>
          <p className="text-base sm:text-sm ">
            This is a place where you can store all your documents
          </p>
        </div>

        {/* File Image - Only on Desktop */}
        <div className="relative w-full h-full">
          <Image
            src="/assets/images/files.png"
            alt="file"
            width={240}
            height={240}
            className="mx-auto hidden sm:block object-contain"
          />
        </div>
      </section>
      {/* Right Section */}
      <section className="flex flex-col w-full p-5 bg-white text-black min-h-screen justify-center items-center gap-10">
        <Image
          src="/assets/icons/logo-full-brand.svg"
          alt="Logo-brand"
          width={250}
          height={250}
          className="block sm:hidden w-auto h-auto"
        />
        {children}
      </section>
    </div>
  );
}

export default layout;
