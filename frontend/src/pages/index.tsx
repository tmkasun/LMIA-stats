import Head from "next/head";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getLMIAs, getMetaData } from "~/apis/lmiaFE";
import AppBar from "~/components/AppBar";
import Chip from "~/components/Chip";
import { useFilters } from "~/components/Filters";
import Search from "~/components/Search";
import Selector, { ISelectData } from "~/components/Selector";
import Table from "~/components/Table";
import { ILMIA, LMIAMetaData, LMIAResponseData } from "~/types/api";
import { useDebounce } from "~/utils/utils";

export interface ISearch extends ILMIA {
  sortBy?: string;
  order?: number;
  page?: number;
  quarter?: string;
}

const MainPage = () => {
  const [isPending, setIsPending] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);

  const { province, programStream, occupation, isNegative, quarter, UI } = useFilters({
    sortBy,
    sortOrder,
    pageNumber,
  });
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
    if (router.isReady) {
      const { employer, sortBy, order } = router.query;
      if (employer) {
        setSearchInput(employer as string);
      }
      if (sortBy) {
        setSortBy(sortBy as string);
      }
      if (order) {
        setSortOrder(parseInt((order as string) || "") || 0);
      }
    }
  }, [router.isReady]);

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
          {UI}
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
