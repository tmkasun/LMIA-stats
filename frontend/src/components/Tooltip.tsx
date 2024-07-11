import { useState } from "react";

export interface ITooltip {
  children: React.ReactNode;
  message: string;
  position?: "top" | "bottom";
}

export const ToolTip = (props: ITooltip) => {
  const { children, message, position = "top" } = props;
  const [isToolTipOpen, setIsToolTipOpen] = useState(false);

  return (
    <div
      className="relative shrink-0 flex gap-x-1"
      onMouseEnter={() => setIsToolTipOpen(true)}
      onMouseLeave={() => setIsToolTipOpen(false)}
    >
      {children}
      {isToolTipOpen && (
        <div className="absolute bottom-6 left-0 bg-gray-800 text-white p-2 whitespace-nowrap rounded-lg">
          {message}
        </div>
      )}
    </div>
  );
};
