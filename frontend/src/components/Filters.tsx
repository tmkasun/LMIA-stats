import { useEffect, useState } from "react";
import Selector, { ISelectData } from "./Selector";
import { useRouter } from "next/router";
import { occupations, programStreams, provinces } from "~/data/filters";

import Chip from "./Chip";
import { useQuery } from "react-query";
import { LMIAMetaData } from "~/types/api";
import { getMetaData } from "~/apis/lmiaFE";
import { ToolTip } from "./Tooltip";

export const useFilters = ({ sortBy, hide, pageNumber }: any) => {
  const [isNegative, setIsNegative] = useState(false);
  const [occupation, setOccupation] = useState("");
  const [province, setProvince] = useState("");
  const [programStream, setProgramStream] = useState("");
  const [quarter, setQuarter] = useState<null | ISelectData>(null);
  const router = useRouter();
  const {
    data: metaData,
    isError: isMetaDataError,
    isLoading: isMetaDataLoading,
  } = useQuery<LMIAMetaData>(["getMetaData"], getMetaData);
  const quarters = metaData?.quarters?.map((q) => ({
    key: `${q.year}-${q.month}`,
    name: `${q.year}-${new Date(2009, q.month - 1, 12).toLocaleString("default", { month: "long" })}`,
  }));
  useEffect(() => {
    if (router.isReady) {
      const { employer, province, programStream, sortBy, occupation, order, quarter } = router.query;
      if (province) {
        setProvince(province as string);
      }
      if (programStream) {
        setProgramStream(programStream as string);
      }

      if (occupation) {
        setOccupation(occupation as string);
      }

      if (quarter) {
        setQuarter({ key: quarter as string, name: quarter as string });
      }
    }
  }, [router.isReady]);

  const handleReset = () => {
    setProgramStream("");
    setProvince("");
    // setSortBy("");
    // setSortOrder(0);
    // setSearchInput("");
    // setPageNumber(0);

    setOccupation("");
    setIsNegative(false);
    setQuarter(null);
  };

  const hideProvince = hide?.province || false;

  const UI = (
    <div className="py-4 px-2 flex sm:shrink-0 flex-col gap-6 rounded-2xl border border-gray-100 dark:bg-gray-700 dark:text-gray-50 bg-gray-50 sm:w-72">
      <h2 className="text-gray-950 text-xl dark:text-gray-50 font-semibold leading-6">Filters</h2>
      {!hideProvince && (
        <Selector
          value={province}
          data={provinces}
          label="Province"
          onChange={(newProvince) => {
            setProvince(newProvince.key);
          }}
        />
      )}
      <Selector
        searchable
        data={occupations}
        label="Occupation"
        onChange={(newOccupation) => setOccupation(newOccupation.key)}
      />
      <Selector
        value={programStream}
        data={programStreams}
        label="Program Stream"
        onChange={(newProgramStream) => {
          setProgramStream(newProgramStream.key);
        }}
      />
      <Selector
        value={quarter?.key}
        data={quarters || []}
        label="Quarter"
        onChange={(newYear) => {
          setQuarter(newYear);
        }}
      />
      <div className="flex justify-start gap-4 border border-gray-50 p-1 rounded-md">
        <input
          id="is-negative-check"
          onChange={(e) => setIsNegative(e.target.checked)}
          className="p-4 scale-125 ml-1"
          type="checkbox"
          name="isnegative"
          checked={isNegative}
        />
        <label htmlFor="is-negative-check" className="cursor-pointer">
          Show Only Negative
        </label>
      </div>
      {(programStream || province || sortBy || occupation || pageNumber !== 0 || isNegative) && (
        <button
          onClick={handleReset}
          className="flex justify-center items-center dark:bg-blue-400 bg-[#443BBC] py-2 px-4 text-white rounded-xl h-[2.5rem]"
        >
          Reset
        </button>
      )}
      <div className="flex flex-col gap-y-4">
        {province && (
          <Chip
            onClose={() => {
              setProvince("");
            }}
          >
            Province: <span className="font-semibold block truncate grow">{province}</span>
          </Chip>
        )}
        {occupation && (
          <Chip
            onClose={() => {
              setOccupation("");
            }}
          >
            Occupation: <span className="font-semibold block truncate grow">{occupation}</span>
            <ToolTip message={occupation}>
              <svg
                className="w-4 h-4  cursor-help "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </ToolTip>
          </Chip>
        )}
        {programStream && (
          <Chip
            onClose={() => {
              setProgramStream("");
            }}
          >
            Stream: <span className="font-semibold block truncate grow">{programStream}</span>
          </Chip>
        )}
        {sortBy && (
          <Chip
            onClose={() => {
              //   setSortBy("");
              //   setSortOrder(0);
            }}
          >
            Sort By: <span className="font-semibold block truncate grow">{sortBy}</span>
          </Chip>
        )}
        {quarter && (
          <Chip
            onClose={() => {
              setQuarter(null);
            }}
          >
            Quarter: <span className="font-semibold block truncate grow">{quarter.name}</span>
          </Chip>
        )}
      </div>
    </div>
  );

  return {
    province,
    programStream,
    occupation,
    isNegative,
    quarter,
    UI,
    handleReset,
  };
};
