import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import Script from "next/script";
import Drawer from "~/components/Drawer";
import Footer from "~/components/Footer";

const figtree = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Canada LMIA Stats",
  description: "Visualize Canadian LMIA statistics using the historical stats Canada data.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-VGHH1YG3R2" />
      <Script id="google-analytics">
        {
          `
        window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-VGHH1YG3R2');
        `
        }
      </Script>
      <div className={`grow flex flex-col mx-1 sm:mx-6 gap-y-4 ${figtree.className}`}>
        {children}
        <Footer />
      </div>
    </>);
}
