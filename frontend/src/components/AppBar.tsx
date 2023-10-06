import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

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
      className={"p-2 font-semibold border shadow rounded-t-none rounded-2xl flex h-20 justify-between w-full items-center text-black"}
    >
      <Link className="flex justify-center items-center overflow-hidden h-16" href="/">
        <img className="overflow-hidden -ml-10" src="/images/HD-wordmark-white.gif" width={250} />{" "}
        <h1 className="-ml-10 flex font-serif font-light justify-end items-end h-full mb-3 text-4xl ">LMIAs</h1>
      </Link>
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
          className="border-b-2  shadow-red-100 hover:shadow-md hover:bg-red-300 hover:border-red-400 shadow-sm rounded-lg bg-red-200 border-red-300 p-4"
        >
          Subscribe
        </button>
        {/* Action buttons */}
        <a
          target="_blank"
          className={"text-blue-600 flex justify-center items-center gap-x-1 hover:text-blue-500"}
          href="https://www.canada.ca/en/immigration-refugees-citizenship/corporate/mandate/policies-operational-instructions-agreements/ministerial-instructions/express-entry-rounds.html#wb-auto-4"
        >
          Data Source <IconExternalLink />
        </a>
        <a
          target="_blank"
          className={
            " text-blue-600 bg-[#FFFFFF1F] flex gap-x-1 hover:text-blue-500 rounded-xl gap-2 py-4 px-[1.375rem] items-center"
          }
          href="https://github.com/tmkasun/Canada-PR-statistics"
        >
          <svg
            className="w-6 h-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
