import { useCallback, useEffect, useRef } from "react";

export function isNumeric(str: string | number) {
  throw new Error("Not implemented!");
}
export const API_BASE_PATH = process.env.NEXT_PUBLIC_API_ENDPOINT;

export const useDebounce = (callback: Function, timeout = 1000) => {
  const timeoutIDRef = useRef<NodeJS.Timeout>();
  const callbackRef = useRef<Function>(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  const debouncedFunction = useCallback((...args: any[]) => {
    if (timeoutIDRef.current) {

      clearInterval(timeoutIDRef.current);
    }
    timeoutIDRef.current = setTimeout(() => callbackRef.current(...args), timeout);
  }, [timeout]);
  return debouncedFunction;
};

export function formatNumber(num: number) {
  const absNum = Math.abs(num);
  if (absNum >= 1e9) return (num / 1e9).toFixed(3) + "B";
  if (absNum >= 1e6) return (num / 1e6).toFixed(3) + "M";
  if (absNum >= 1e3) return (num / 1e3).toFixed(3) + "K";
  return num.toString();
}