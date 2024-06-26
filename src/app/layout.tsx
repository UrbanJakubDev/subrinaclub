import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "../components/header/navbar";
import NavIndex from "../components/header";
import Footer from "../components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body className={inter.className}>
        <NavIndex />
        <main className="bg-white my-8 mx-auto overflow-hidden flex-grow ">
        {children}
        </main>
        <Footer />
        </body>
    </html>
  );
}
