import Head from "next/head";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getLMIAs } from "~/apis/lmia";
import AppBar from "~/components/AppBar";
import Search from "~/components/Search";
import Selector from "~/components/Selector";
import Table from "~/components/Table";
import { LMIAResponseData } from "~/types/api";
import { useDebounce } from "~/utils/utils";

export interface ISearch {
    employer?: string
}

const MainPage = () => {
    const [searchInput, setSearchInput] = useState("");
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState<ISearch>({});
    const updateQuery = useCallback((newQuery: ISearch) => {
        setSearchQuery(newQuery);
        router.query = newQuery as ParsedUrlQuery;
        router.push(router);
    }, [router]);
    const debouncedUpdateQuery = useDebounce(updateQuery);

    const { data, isError, isLoading } = useQuery<LMIAResponseData>(["getLMIAs", searchQuery], getLMIAs);

    useEffect(() => {
        const newQuery: ISearch = {};
        if (searchInput) {
            newQuery.employer = searchInput;
        }
        debouncedUpdateQuery(newQuery);
    }, [searchInput, debouncedUpdateQuery]);
    useEffect(() => {
        if (router.isReady) {
            setSearchInput(router.query?.employer as string || "");
            setSearchQuery(router.query);
        }
    }, [router.isReady]);
    return (
        <>
            <Head>
                <title>Canada PR Statistics</title>
            </Head>
            <div className="flex flex-col justify-start items-center grow gap-y-4">
                <AppBar />
                <Search placeholder="Employer Name" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} endAdornment={(<span>{data?.pagination?.total} Total</span>)} />
                <div className="flex w-full grow gap-4">
                    <div className="py-4 px-2 flex shrink-0 flex-col gap-6 rounded-2xl border border-gray-100 bg-gray-50 w-72">
                        <h2 className="text-gray-950 text-xl font-semibold leading-6">Filters</h2>
                        <Selector data={[{ name: "ontario", key: "ontario" }]} label='Province' onChange={() => { }} />
                        <Selector data={[{ name: "Software", key: "ontario" }]} label='Occupation' onChange={() => { }} />
                        <Selector data={[{ name: "GTS", key: "ontario" }]} label='Program Stream' onChange={() => { }} />
                    </div>
                    {!isError && <Table isLoading={isLoading} data={data?.payload} />}
                    {isError && <h1 className="text-3xl text-red-600">Error!</h1>}
                </div>
            </div>
        </>
    );
};

export default MainPage;
