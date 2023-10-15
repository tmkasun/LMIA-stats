import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Drawer from "./Drawer";
import IconExternalLink from "./IconExternalLink";


export default function AppBar({ children }: { children?: React.ReactNode }) {
  const location = useRouter();
  const { pathname } = location;
  return (
    <div
      className={"p-2 font-semibold border dark:bg-white shadow rounded-t-none rounded-2xl flex h-fit justify-between w-full items-center text-black"}
    >
      <div className="flex grow sm:grow-0 justify-start items-center">
        <Drawer />
        <Link className="flex justify-center items-center overflow-hidden h-16" href="/">
          <img className="overflow-hidden -ml-10" src="/images/HD-wordmark-white.gif" width={250} />{" "}
          <h1 className="-ml-10 flex font-serif font-light justify-end items-end h-full mb-3 text-4xl ">LMIAs</h1>
        </Link>
      </div>
      <div className="hidden sm:visible sm:flex gap-x-10 flex-row">
        <Link href="/" className={`${pathname === "/" && "border-b-2   border-blue-600"} p-3`}>
          LMIA
        </Link>
        <Link href="/none-compliant" className={` ${pathname === "/none-compliant" && "border-b-2   border-blue-600"}  p-3`}>
          None Compliant Companies{" "}
        </Link>
        <Link href="https://canpr.knnect.com/" className={` ${pathname === "/pnp" && "border-b-2   border-blue-600"}  p-3 flex justify-center items-center gap-x-1`}>
          PR Stats <IconExternalLink />
        </Link>
      </div>
      {children}

      <div className="hidden sm:visible sm:flex gap-x-8 justify-center items-center">
        <button
          onClick={() => alert("Coming soon!")}
          className="border-b-2  shadow-red-50 hover:shadow-md hover:bg-red-200 hover:border-red-200 shadow-sm rounded-lg bg-red-50 border-red-100 p-4"
        >
          Subscribe
        </button>
      </div>
    </div>
  );
}
