import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Drawer from "./Drawer";

export const IconExternalLink = () => (
  <svg
    className="w-3 h-3 text-gray-950 dark:text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 18 18"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1"
      d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"
    />
  </svg>
);

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
          Approved
        </Link>
        <Link href="/pnp" className={` ${pathname === "/pnp" && "border-b-2   border-blue-600"}  p-3`}>
          None Compliant Companies{" "}
        </Link>
        <Link href="https://canpr.knnect.com/" className={` ${pathname === "/pnp" && "border-b-2   border-blue-600"}  p-3`}>
          PR Stats{" "}
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
