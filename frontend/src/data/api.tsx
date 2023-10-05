import { useEffect, useState } from "react";
import mockData from "./mockData";
import { IIRCCData } from "./consts";

export const clearAndParseNumber = (numberInString: string) => {
  let parsedNumber;

  try {
    parsedNumber = parseInt(numberInString.replace(/,/g, ""));
  } catch (error) {
    console.error(`Error while parsing ${numberInString}`);
    console.error(error);
  }
  return parsedNumber;
};
export const useIRCCData = (isMocked = false) => {
  const [data, setData] = useState<null | IIRCCData>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isStale = false;
    (async () => {
      setIsLoading(true);
      if (isMocked) {
        return await new Promise((r) => {
          setTimeout(() => {
            setData(mockData as any);
            setIsLoading(false);
          }, 2000);
        });
      }
      const res = await fetch("https://www.canada.ca/content/dam/ircc/documents/json/ee_rounds_123_en.json");
      const data = await res.json();
      if (!isStale) {
        setData(data);
      }
      setIsLoading(false);
      return () => {
        isStale = true;
      };
    })();
  }, []);
  return { data, isLoading };
};

export default useIRCCData;
