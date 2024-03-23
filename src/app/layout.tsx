import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GridLines } from "@/assets/svgs";
import { Icons } from "@/components/Icons";
import SearchBar from "@/components/SearchBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Magic Search",
  description: "Sematic search for your products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="relative min-h-screen isolate border-b border-gray-200 bg-white text-slate-900 overflow-hidden">
          <GridLines />
          <div className="max-w-7xl mx-auto px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:gap-16 lg:px-8 lg:py-24">
            <div className="w-full h-full flex flex-col items-center gap-4">
              <Icons.Sparkles className="h-16 w-16" />
              <h1 className="tracking-tight text-4xl lg:text-6xl font-bold">
                MagicSearch
              </h1>
              <p className="max-w-xl text-center text-lg text-slate-700">
                A beautifully designed, search engine that enhances search
                accuracy by querying semantically related result
              </p>
              <div className="max-w-2xl w-full max-auto mt-16 flex flex-col">
                <SearchBar />
                {children}
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
