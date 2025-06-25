"use client";
import { navItems } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

function SideBar({
  name,
  email,
  avatar,
}: {
  name: string;
  email: string;
  avatar: string;
}) {
  const pathname = usePathname();
  return (
    <aside className="hidden sm:flex max-w-[270px] w-full min-h-screen bg-white shadow-lg flex-col justify-between p-4">
      {/* Logo */}
      <div>
        <Image
          src="/assets/icons/logo-full-brand.svg"
          alt="logo"
          width={160}
          height={100}
          className="mx-auto mt-6 mb-10"
        />

        {/* Navigation */}
        <ul className="space-y-2">
          {navItems.map(({ name, Icon, url }) => {
            const isActive = pathname === url;
            return (
              <li
                key={name}
                className={cn(
                  "rounded-xl transition-colors",
                  isActive ? "bg-red-500 shadow-md" : "hover:bg-red-100"
                )}
              >
                <Link
                  href={url}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-base font-medium",
                    isActive ? "text-white" : "text-gray-700"
                  )}
                >
                  <Icon />
                  <span>{name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bottom Section */}
      <div className="space-y-4 mt-6">
        <Image
          src="/assets/images/files.png"
          alt="Files Illustration"
          width={120}
          height={100}
          className="mx-auto"
        />

        <div className="flex items-center gap-3 bg-yellow-100 p-3 rounded-2xl shadow-sm">
          <Image
            src={String(avatar)}
            alt="User"
            width={40}
            height={40}
            className="rounded-full object-cover border border-yellow-300"
          />
          <div>
            <p className="font-semibold text-gray-800 text-[14px]">{name}</p>
            <p className="text-gray-600 text-[12px]">{email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default SideBar;
