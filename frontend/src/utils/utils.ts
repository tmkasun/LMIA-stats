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
