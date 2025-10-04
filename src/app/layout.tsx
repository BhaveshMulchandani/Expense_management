import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Expense Management System",
  description: "Track and manage your expenses efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-black text-black dark:text-white">
        <AuthProvider>
          <Navigation />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
