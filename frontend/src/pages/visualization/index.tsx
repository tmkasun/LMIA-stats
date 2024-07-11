import Head from "next/head";
import AppBar from "~/components/AppBar";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import GeoMapChart from "~/components/GeoMapChart";
import { useQuery } from "react-query";
import { getGeoStats } from "~/apis/lmiaFE";
import { useFilters } from "~/components/Filters";
import { useCallback, useEffect, useState } from "react";
import { ParsedUrlQuery } from "querystring";
import { useRouter } from "next/router";
import { ISearch } from "..";
import { useDebounce } from "~/utils/utils";
dayjs.extend(customParseFormat);

const MainPage = () => {
  const [searchQuery, setSearchQuery] = useState<ISearch>({});
  const router = useRouter();

  const updateQuery = useCallback(
    (newQuery: ISearch) => {
      setSearchQuery(newQuery);
      router.query = newQuery as ParsedUrlQuery;
      router.push(router);
    },
    [router],
  );
  const debouncedUpdateQuery = useDebounce(updateQuery);

  const {
    data: metaData,
    isError: isMetaDataError,
    isLoading: isMetaDataLoading,
  } = useQuery(["getGeoData", searchQuery], getGeoStats);
  const { province, programStream, occupation, isNegative, quarter, UI } = useFilters({
    sortBy: "",
    sortOrder: 0,
    pageNumber: 0,
  });

  useEffect(() => {
    const newQuery: ISearch = {};

    if (programStream) {
      newQuery.programStream = programStream;
    }
    if (province) {
      newQuery.province = province;
    }

    if (occupation) {
      newQuery.occupation = occupation;
    }

    if (isNegative) {
      newQuery.isNegative = isNegative;
    }
    if (quarter) {
      newQuery.quarter = quarter.key;
    }
    debouncedUpdateQuery(newQuery);
  }, [debouncedUpdateQuery, province, programStream, occupation, isNegative, quarter]);
  return (
    <>
      <Head>
        <title>Canada PR Statistics</title>
      </Head>
      <div className="flex flex-col justify-start items-center grow gap-y-4">
        <AppBar />
        <div className="flex flex-col flex flex-col sm:flex-row w-full grow gap-4">
          {UI}
          <GeoMapChart data={metaData} />
        </div>
      </div>
    </>
  );
};

export default MainPage;
