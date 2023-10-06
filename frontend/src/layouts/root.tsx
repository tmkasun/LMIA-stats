import type { Metadata } from "next";
import { Figtree } from "next/font/google";

const figtree = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Canada PR Stats",
  description: "Visualize Canadian PR statistics using the live IRCC data API.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <div className={`grow flex flex-col mx-1 sm:mx-6 pb-4 ${figtree.className}`}>{children}
  </div>;
}
