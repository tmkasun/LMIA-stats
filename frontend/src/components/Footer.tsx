import Link from "next/link";
import { ToolTip } from "./Tooltip";
import { useQuery } from "react-query";
import { LMIAMetaData } from "~/types/api";
import { getMetaData } from "~/apis/lmiaFE";

export default function Footer() {
    const {
        data: metaData,
        isError: isMetaDataError,
        isLoading: isMetaDataLoading,
    } = useQuery<LMIAMetaData>(["getMetaData"], getMetaData);
    const mostRecentQuarter = metaData?.quarters?.[0];
    return (
        <footer
            className={
                "px-4 py-2 font-semibold border dark:border-slate-600 dark:bg-gray-700 shadow rounded-b-none rounded-2xl flex h-10 justify-between w-full items-center text-black"
            }
        >
            <div className="text-gray-700 dark:text-gray-200 font-light text-sm hover:text-blue-700 transform">
                &copy; Knnect.com 2023
            </div>
            {/* Show most recent record date */}
            <div className="text-gray-700 dark:text-gray-200 font-light text-sm transform">
                Data as of -{" "}
                {isMetaDataLoading
                    ? "Loading..."
                    : mostRecentQuarter
                    ? `${mostRecentQuarter.year}-${mostRecentQuarter.month}`
                    : "No Data"}
            </div>
            <div className="flex justify-center items-center gap-4 ">
                <Link href="https://github.com/tmkasun/LMIA-stats" target="_blank">
                    <ToolTip message="Source Code">
                        <svg
                            className="w-6 h-6 text-gray-600 dark:text-white hover:text-blue-700"
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
                    </ToolTip>
                </Link>
                <Link
                    href="https://open.canada.ca/data/en/dataset/90fed587-1364-4f33-a9ee-208181dc0b97"
                    target="_blank"
                >
                    <ToolTip message="Data Source">
                        <svg
                            className="w-6 h-6 text-gray-600 hover:text-blue-700 dark:text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 18 20"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17 4c0 1.657-3.582 3-8 3S1 5.657 1 4m16 0c0-1.657-3.582-3-8-3S1 2.343 1 4m16 0v6M1 4v6m0 0c0 1.657 3.582 3 8 3s8-1.343 8-3M1 10v6c0 1.657 3.582 3 8 3s8-1.343 8-3v-6"
                            />
                        </svg>
                    </ToolTip>
                </Link>
            </div>
        </footer>
    );
}
