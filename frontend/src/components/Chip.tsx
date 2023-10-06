import React from "react";

export interface IChip {
    children: React.ReactNode,
    onClose?: () => void
}
export default function Chip(props: IChip) {
    const { children, onClose } = props;
    return (
        <div className="gap-x-2 flex justify-start items-center bg-[#F1F5FB] py-2 px-4 text-[#020618] rounded-xl h-[2.5rem] capitalize">
            {children}
            {onClose && (<button className="cursor-pointer" onClick={onClose} aria-label="Close chip"><img src="/images/cross.svg" alt="close" /></button>)}
        </div >
    );
}