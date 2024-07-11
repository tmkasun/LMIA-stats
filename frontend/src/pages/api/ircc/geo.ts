import { Sort, SortDirection } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise, { getCollection } from "~/lib/mongodb";
import { ILMIA, LMIAResponseData } from "~/types/api";
import { allowedQueryParamsMapping } from "./lmia";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const collection = await getCollection();
    const { query } = req;

    let limit = 10;
    let page = 0;
    let searchQuery: { [key: string]: RegExp | boolean | {} } = {};
    for (let [key, value] of Object.entries(query)) {
      const allowedQueryParams = [
        ...Object.keys(allowedQueryParamsMapping),
        "limit",
        "offset",
        "sortby",
        "page",
        "order",
      ];
      if (!allowedQueryParams.includes(key.toLowerCase())) {
        res.status(400).json({ error: `'${key}' is not one of the allowed keys (${allowedQueryParams.join()})` });
        return;
      }
      if (typeof value === "string" && Object.keys(allowedQueryParamsMapping).includes(key.toLowerCase())) {
        if (key.toLowerCase() === "isnegative") {
          if (value.toLowerCase() === "true") {
            searchQuery[allowedQueryParamsMapping[key.toLowerCase()]] = true;
          }
        } else if (key.toLocaleLowerCase() === "quarter") {
          const [year, month] = (value as string).split("-");
          const qDate = new Date(`${year}-${month}-01`);
          const startDate = new Date(new Date(`${year}-${month}-01`).setMonth(qDate.getMonth() - 2));
          const endDate = new Date(new Date(`${year}-${month}-01`).setMonth(qDate.getMonth() + 2));
          searchQuery[allowedQueryParamsMapping[key.toLowerCase()]] = {
            $gte: startDate,
            $lt: endDate,
          };
        } else {
          var regex = new RegExp(value, "i");
          searchQuery[allowedQueryParamsMapping[key.toLowerCase()]] = regex;
        }
      }
    }

    const limitParam = Object.entries(query).find(([k, v]) => k.toLowerCase() === "limit");
    if (limitParam) {
      limit = parseInt(limitParam[1] as string);
    }

    const pageParam = Object.entries(query).find(([k, v]) => k.toLowerCase() === "page");
    if (pageParam) {
      page = parseInt(pageParam[1] as string);
    }

    const sortByParam = Object.entries(query).find(([k, v]) => k.toLowerCase() === "sortby");
    const orderParam = Object.entries(query).find(([k, v]) => k.toLowerCase() === "order");
    let sortBy: Sort = { time: -1 };
    if (sortByParam) {
      let order: SortDirection = -1;
      if (orderParam) {
        const [, orderDirection] = orderParam;
        if (!["asc", "desc", "-1", "1"].includes((orderDirection as string).toLowerCase())) {
          throw new Error(`${orderDirection} is not valid sort order string, has to be one of 'asc', 'desc', -1, 1`);
        }
        order = parseInt(orderDirection as string) as SortDirection;
      }
      sortBy = { [sortByParam[1] as string]: order };
    }
    const resultsCursor = await collection.aggregate([
      { $match: searchQuery },
      { $group: { _id: "$province", count: { $sum: { $add: "$approvedPositions" } } } },
    ]);
    const results = (await resultsCursor.toArray()).map((doc) => ({ province: doc._id, count: doc.count }));
    res.status(200).json({ payload: results, pagination: { total: results.length } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `${error}` });
  }
}
