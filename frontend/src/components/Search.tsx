import Image from "next/image";
import React, { useEffect, useRef } from "react";
export interface ISearch extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "endAdornment"> {
    endAdornment?: React.ReactNode
}
export default function Search(props: ISearch) {
    const searchInputRef = useRef<HTMLInputElement | null>(null);
    const { value, onChange } = props;
    const {endAdornment, ...inputProps} = props;
    useEffect(() => {
        // Auto focus the search input when loading the main/marketplace page
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, []);
    return (
        <div className="relative w-full sm:w-fit ">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Image src="/images/search-icon.svg" alt="search icon"
                    width="0"
                    height="0"
                    sizes="100vw"
                    className="w-full h-auto"
                />
            </div>
            <input onChange={onChange} value={value} ref={searchInputRef} placeholder="Search" type="text" role="search" {...inputProps} className="text-gray-950 dark:text-gray-50 dark:bg-slate-600 w-full sm:w-[44rem] text-lg leading-5 block p-5 focus:border-blue-500 pl-12 justify-between items-center rounded-2xl border border-[#CBD5E1] bg-white" />
            {endAdornment && (
                <div className="text-[#94A5B9] text-lg leading-6 absolute right-2.5 bottom-2.5 px-4 py-2 ">
                    {endAdornment}
                </div>
            )}
        </div>
    );
}