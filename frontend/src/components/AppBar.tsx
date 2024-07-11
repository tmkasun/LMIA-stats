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
      className={
        "p-2 font-semibold border dark:bg-white shadow rounded-t-none rounded-2xl flex h-fit justify-between w-full items-center text-black"
      }
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
        <Link
          href="/visualization"
          className={` ${pathname === "/visualization" && "border-b-2   border-blue-600"}  p-3`}
        >
          Visualization{" "}
        </Link>
        <Link
          href="https://canpr.knnect.com/"
          className={` ${
            pathname === "/pnp" && "border-b-2   border-blue-600"
          }  p-3 flex justify-center items-center gap-x-1`}
        >
          PR Stats <IconExternalLink />
        </Link>
      </div>
      {children}

      <div className="hidden sm:visible sm:flex gap-x-8 justify-center items-center">
        <button
          onClick={() => alert("Coming soon!")}
          className="border-b-2  shadow-gray-50 hover:shadow-md hover:bg-gray-300 hover:border-gray-300 shadow-sm rounded-lg bg-gray-200 border-gray-200 p-4"
        >
          <svg
            className="w-8 h-8 text-gray-800 dark:text-blue-400 cursor-pointer"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.133 12.632v-1.8a5.406 5.406 0 0 0-4.154-5.262.955.955 0 0 0 .021-.106V3.1a1 1 0 0 0-2 0v2.364a.955.955 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C6.867 15.018 5 15.614 5 16.807 5 17.4 5 18 5.538 18h12.924C19 18 19 17.4 19 16.807c0-1.193-1.867-1.789-1.867-4.175ZM8.823 19a3.453 3.453 0 0 0 6.354 0H8.823Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
