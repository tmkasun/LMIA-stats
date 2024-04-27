import Head from "next/head";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getLMIAs, getMetaData } from "~/apis/lmiaFE";
import AppBar from "~/components/AppBar";
import Chip from "~/components/Chip";
import Search from "~/components/Search";
import Selector, { ISelectData } from "~/components/Selector";
import Table from "~/components/Table";
import { occupations, programStreams, provinces } from "~/data/filters";
import { ILMIA, LMIAMetaData, LMIAResponseData } from "~/types/api";
import { useDebounce } from "~/utils/utils";

export interface ISearch extends ILMIA {
  sortBy?: string;
  order?: number;
  page?: number;
  quarter?: string;
}

const MainPage = () => {
  const {
    data: metaData,
    isError: isMetaDataError,
    isLoading: isMetaDataLoading,
  } = useQuery<LMIAMetaData>(["getMetaData"], getMetaData);

  const [isPending, setIsPending] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [isNegative, setIsNegative] = useState(false);
  const [occupation, setOccupation] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [province, setProvince] = useState("");
  const [programStream, setProgramStream] = useState("");
  const [quarter, setQuarter] = useState<null | ISelectData>(null);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<ISearch>({});
  const updateQuery = useCallback(
    (newQuery: ISearch) => {
      setSearchQuery(newQuery);
      router.query = newQuery as ParsedUrlQuery;
      router.push(router);
    },
    [router],
  );
  const debouncedUpdateQuery = useDebounce(updateQuery);

  const { data, isError, isLoading } = useQuery<LMIAResponseData>(["getLMIAs", searchQuery], getLMIAs, {
    onSettled: () => setIsPending(false),
  });

  useEffect(() => {
    const newQuery: ISearch = {};
    if (searchInput) {
      newQuery.employer = searchInput;
    }
    if (programStream) {
      newQuery.programStream = programStream;
    }
    if (province) {
      newQuery.province = province;
    }
    if (sortBy) {
      newQuery.sortBy = sortBy;
    }
    if (sortOrder) {
      newQuery.order = sortOrder;
    }

    if (occupation) {
      newQuery.occupation = occupation;
    }
    if (pageNumber) {
      newQuery.page = pageNumber;
    }
    if (isNegative) {
      newQuery.isNegative = isNegative;
    }
    if (quarter) {
      newQuery.quarter = quarter.key;
    }
    setIsPending(true);
    debouncedUpdateQuery(newQuery);
  }, [
    searchInput,
    debouncedUpdateQuery,
    province,
    programStream,
    sortBy,
    sortOrder,
    occupation,
    pageNumber,
    isNegative,
    quarter,
  ]);
  useEffect(() => {
    if (router.isReady) {
      const { employer, province, programStream, sortBy, occupation, order, quarter } = router.query;
      if (employer) {
        setSearchInput(employer as string);
      }
      if (province) {
        setProvince(province as string);
      }
      if (programStream) {
        setProgramStream(programStream as string);
      }
      if (sortBy) {
        setSortBy(sortBy as string);
      }
      if (occupation) {
        setOccupation(occupation as string);
      }
      if (order) {
        setSortOrder(parseInt((order as string) || "") || 0);
      }
      if (quarter) {
        setQuarter({ key: quarter as string, name: quarter as string });
      }
    }
  }, [router.isReady]);

  const handleReset = () => {
    setProgramStream("");
    setProvince("");
    setSortBy("");
    setSortOrder(0);
    setSearchInput("");
    setOccupation("");
    setPageNumber(0);
    setIsNegative(false);
    setQuarter(null);
  };

  const quarters = metaData?.quarters.map((q) => ({
    key: `${q.year}-${q.month}`,
    name: `${q.year}-${new Date(2009, q.month - 1, 12).toLocaleString("default", { month: "long" })}`,
  }));
  return (
    <>
      <Head>
        <title>Canada LMIA Statistics</title>
      </Head>
      <div className="flex flex-col justify-start items-center grow gap-y-4">
        <AppBar />
        <Search
          placeholder="Enter Employer Name"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setPageNumber(0);
          }}
          endAdornment={<span>{data?.pagination?.total} Records</span>}
        />
        <div className="flex flex-col sm:flex-row w-full grow gap-4">
          <div className="py-4 px-2 flex sm:shrink-0 flex-col gap-6 rounded-2xl border border-gray-100 dark:bg-gray-700 dark:text-gray-50 bg-gray-50 sm:w-72">
            <h2 className="text-gray-950 text-xl dark:text-gray-50 font-semibold leading-6">Filters</h2>
            <Selector
              value={province}
              data={provinces}
              label="Province"
              onChange={(newProvince) => {
                setProvince(newProvince.key);
              }}
            />
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
              label="Year"
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
                    setSortBy("");
                    setSortOrder(0);
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
          {!isError && (
            <Table
              isPending={isPending}
              page={pageNumber}
              onNext={() => {
                setPageNumber((p) => p + 1);
              }}
              onPrevious={() => {
                setPageNumber((p) => p - 1);
              }}
              onSort={(sort) => {
                setSortBy(sort);
                if (sortOrder === -1) {
                  setSortOrder(1);
                } else {
                  setSortOrder(-1);
                }
              }}
              isLoading={isLoading}
              data={data}
            />
          )}
          {isError && <h1 className="text-3xl text-red-600">Error!</h1>}
        </div>
      </div>
    </>
  );
};

export default MainPage;
