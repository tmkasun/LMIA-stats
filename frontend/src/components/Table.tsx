import dayjs from "dayjs";
import { ILMIA, LMIAResponseData } from "~/types/api";

export interface ITable {
    data?: LMIAResponseData
    isLoading?: boolean
    isPending?: boolean
    page?: number
    onSort?: (sort: string) => void
    onNext?: () => void
    onPrevious?: () => void
}
export default function Table(props: ITable) {
    const { data, isLoading, onSort, onNext, onPrevious, page = 0, isPending } = props;
    const { payload: records } = data || {};
    return (
        <div className="flex gap-4 flex-col grow">
            <div className="relative overflow-x-auto grow w-full dark:shadow-slate-600 shadow-md sm:rounded-lg">
                <table className={`${isPending && "animate-pulse"} w-full text-sm h-full text-left text-gray-500 dark:text-gray-400`}>
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Employer name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <button onClick={() => onSort && onSort("province")} className="flex items-center cursor-pointer hover:text-blue-700">
                                    Province
                                    <a href="#"><svg className="w-3 h-3 ml-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                                    </svg></a>
                                </button>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <div className="flex items-center">
                                    Program Stream
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <div className="flex items-center">
                                    Occupation
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <button onClick={() => onSort && onSort("time")} className="flex items-center cursor-pointer hover:text-blue-700">
                                    Time
                                    <a href="#"><svg className="w-3 h-3 ml-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                                    </svg></a>
                                </button>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <button onClick={() => onSort && onSort("approvedPositions")} className="flex items-center cursor-pointer hover:text-blue-700">
                                    Approved positions
                                    <a href="#"><svg className="w-3 h-3 ml-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                                    </svg></a>
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {records && records.length === 0 && (
                            <tr className="w-full">
                                <td className="flex w-full justify-center items-center bg-red-200" colSpan={4}>
                                    <h2 className="text-4xl">No results!</h2>
                                </td>
                            </tr>
                        )}
                        {!isLoading && records && records.map((lmia) => (
                            <tr key={lmia._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {lmia.employer}
                                </th>
                                <td className="px-6 py-4">
                                    {lmia.province}
                                </td>
                                <td className="px-6 py-4">
                                    {lmia.programStream}
                                </td>
                                <td className="px-6 py-4">
                                    {lmia.occupation}
                                </td>
                                <td className="px-6 py-4">
                                    {dayjs(lmia.time).format("MMMM-YYYY")}
                                </td>
                                <td className="px-6 py-4">
                                    {lmia.approvedPositions}
                                </td>
                            </tr>
                        ))}
                        {
                            isLoading && (new Array(5).fill(null).map((_, i) => (
                                <tr key={i} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        <div className="animate-pulse h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-40 mb-2.5"></div>
                                    </th>
                                    <td className="px-6 py-4">
                                        <div className="animate-pulse mt-4 w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="animate-pulse mt-4 w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="animate-pulse mt-4 w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="animate-pulse mt-4 w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="animate-pulse mt-4 w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                                    </td>

                                </tr>
                            ))
                            )}
                    </tbody>
                </table>
            </div>
            {data?.pagination && data?.pagination?.total > 10 && (<div className="flex self-end justify-center items-center gap-4">
                <span className="text-sm text-gray-700 dark:text-gray-400">
                    Showing <span className="font-semibold text-gray-900 dark:text-white">{page * 10 + 1}</span> to <span className="font-semibold text-gray-900 dark:text-white">{(page + 1) * 10 > data?.pagination?.total ? data?.pagination?.total : (page + 1) * 10}</span> of <span className="font-semibold text-gray-900 dark:text-white">{data?.pagination?.total}</span> Entries
                </span>
                {page > 0 && (<button disabled={isLoading} onClick={() => onPrevious && onPrevious()} className="flex items-center justify-center px-3 h-8 mr-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    <svg className="w-3.5 h-3.5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5H1m0 0 4 4M1 5l4-4" />
                    </svg>
                    Previous
                </button>)}
                {(page + 1) * 10 < data?.pagination?.total && (<button disabled={isLoading} onClick={() => onNext && onNext()} className="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    Next
                    <svg className="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg>
                </button>)}
            </div>)}
        </div>
    );
}