import React from "react";

export interface IChip {
  children: React.ReactNode;
  onClose?: () => void;
}
export default function Chip(props: IChip) {
  const { children, onClose } = props;
  return (
    <div className="gap-x-2 flex justify-start items-center bg-[#F1F5FB] py-2 px-4 text-[#020618] rounded-xl h-[2.5rem] capitalize">
      {children}
      {onClose && (
        <button className="cursor-pointer" onClick={onClose} aria-label="Close chip">
          <svg
            className="w-6 h-6 text-gray-800 dark:text-gray-400 cursor-pointer"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke-width="2"
              d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
