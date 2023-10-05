import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getLMIAs } from "~/apis/lmia";
import AppBar from "~/components/AppBar";
import Search from "~/components/Search";
import Table from "~/components/Table";
import { LMIAResponseData } from "~/types/api";
import { useDebounce } from "~/utils/utils";

export interface ISearch {
    employer?: string
}

const MainPage = () => {
    const [searchInput, setSearchInput] = useState("");

    const [searchQuery, setSearchQuery] = useState<ISearch>({});
    const updateQuery = useCallback((newQuery: ISearch) => { setSearchQuery(newQuery); }, []);
    const debouncedUpdateQuery = useDebounce(updateQuery);

    const { data, isError, isLoading } = useQuery<LMIAResponseData>(["getLMIAs", searchQuery], getLMIAs);

    useEffect(() => {
        const newQuery: ISearch = {};
        if (searchInput) {
            newQuery.employer = searchInput;
        }
        debouncedUpdateQuery(newQuery);
    }, [searchInput]);
    return (
        <>
            <Head>
                <title>Canada PR Statistics</title>
            </Head>
            <div className="flex flex-col justify-start items-center grow gap-y-4">
                <AppBar />
                <Search placeholder="Employer Name" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} endAdornment={(<span>{data?.pagination?.total} Total</span>)} />
                <div className="flex flex-col w-full  grow gap-8">
                    <Table isLoading={isLoading} data={data?.payload} />
                    {isError && <h1>Error!</h1>}
                </div>
            </div>
        </>
    );
};

export default MainPage;
