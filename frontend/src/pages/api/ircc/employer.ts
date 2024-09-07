import { Sort, SortDirection } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { getCollection } from "~/lib/mongodb";
import { ILMIA, LMIAResponseData } from "~/types/api";
import {
    IEmployerStatsResponse,
    IEmployerStatsPayload,
    IEmployerStatsRequest,
    IGeoLocation,
} from "~/types/employerStats";

export const allowedQueryParamsMapping: { [key: string]: keyof IEmployerStatsRequest } = {
    name: "name",
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<
        | IEmployerStatsResponse
        | {
            error?: string;
        }
    >,
) {
    try {
        const collection = await getCollection();
        const postalCodesCollection = await getCollection("postalcodes");
        const addPostalCode = async (employerStats: IEmployerStatsPayload) => {
            for (const address of employerStats.byAddress) {
                if (!address._id) {
                    console.error("Address is missing _id field", address);
                    continue;
                };
                const partsOfAddress = address._id.split(" ");
                const FSA = partsOfAddress[partsOfAddress.length - 2];
                const LDU = partsOfAddress[partsOfAddress.length - 1];
                const postalCodeRegex = new RegExp(`^${FSA} ${LDU}`);
                const postalCodeData = await postalCodesCollection.findOne<IGeoLocation>({ POSTAL_CODE: postalCodeRegex });
                if (postalCodeData) {
                    address.geolocation = {
                        lat: postalCodeData.LATITUDE,
                        lon: postalCodeData.LONGITUDE,
                        name: postalCodeData.CITY,
                    };
                }
            }
        };
        const { query } = req;

        let searchQuery: { [key: string]: RegExp | boolean | {} } = {};
        for (let [key, value] of Object.entries(query)) {
            const allowedQueryParams = Object.keys(allowedQueryParamsMapping);
            if (!allowedQueryParams.includes(key.toLowerCase())) {
                res.status(400).json({
                    error: `'${key}' is not one of the allowed keys (${allowedQueryParams.join()})`,
                });
                return;
            }
            if (typeof value === "string" && Object.keys(allowedQueryParamsMapping).includes(key.toLowerCase())) {
                searchQuery[allowedQueryParamsMapping[key.toLowerCase()]] = value;
            }
        }

        const data = await collection
            .aggregate<IEmployerStatsPayload>(
                [
                    { $match: { employer: searchQuery.name } },
                    {
                        $facet: {
                            byProvince: [
                                {
                                    $group: {
                                        _id: "$province",
                                        totalLMIAs: { $sum: "$approvedLMIAs" },
                                        totalPositions: { $sum: "$approvedPositions" },
                                        address: { $first: "$address" },
                                    },
                                },
                                { $sort: { totalLMIAs: -1 } },
                            ],
                            byQuarter: [
                                {
                                    $group: {
                                        _id: {
                                            year: { $year: "$time" },
                                            quarter: { $ceil: { $divide: [{ $month: "$time" }, 3] } },
                                        },
                                        totalLMIAs: { $sum: "$approvedLMIAs" },
                                        totalPositions: { $sum: "$approvedPositions" },
                                    },
                                },
                                {
                                    $project: {
                                        _id: 0,
                                        year: "$_id.year",
                                        quarter: "$_id.quarter",
                                        totalLMIAs: 1,
                                        totalPositions: 1,
                                    },
                                },
                                { $sort: { year: 1, quarter: 1 } },
                            ],
                            byOccupation: [
                                {
                                    $group: {
                                        _id: "$occupation",
                                        totalLMIAs: { $sum: "$approvedLMIAs" },
                                        totalPositions: { $sum: "$approvedPositions" },
                                    },
                                },
                                { $sort: { totalLMIAs: -1 } },
                                { $limit: 50 }, // Limiting to top 50 occupations
                            ],
                            byAddress: [
                                {
                                    $group: {
                                        _id: "$address",
                                        totalLMIAs: { $sum: "$approvedLMIAs" },
                                        totalPositions: { $sum: "$approvedPositions" },
                                    },
                                },
                                { $sort: { totalLMIAs: -1 } },
                                { $limit: 50 }, // Limiting to top 50 occupations
                            ],
                            totalStats: [
                                {
                                    $group: {
                                        _id: null,
                                        totalLMIAs: { $sum: "$approvedLMIAs" },
                                        totalPositions: { $sum: "$approvedPositions" },
                                        uniqueEmployers: { $addToSet: "$employer" },
                                    },
                                },
                                {
                                    $project: {
                                        _id: 0,
                                        totalLMIAs: 1,
                                        totalPositions: 1,
                                        uniqueEmployerCount: { $size: "$uniqueEmployers" },
                                    },
                                },
                            ],
                        },
                    },
                ],
                { allowDiskUse: true },
            )
            .toArray();
        await addPostalCode(data[0]);
        res.status(200).json({ payload: data[0], pagination: { total: data.length } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `${error}` });
    }
}
