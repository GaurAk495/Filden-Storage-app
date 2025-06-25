import type { Metadata } from "next";
import "@/app/globals.css";
import { Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Fileden | #1 File Storage",
  description:
    "Fileden is a smart, secure storage app to organize, store, and access your files anytime, anywhere.",
};

const poppins = Poppins({ weight: "500" });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        {children}
        <Toaster
          position="top-right"
          richColors
          expand={true}
          closeButton={true}
        />
      </body>
    </html>
  );
}
