import { NextApiRequest, NextApiResponse } from "next";
import { getCollection } from "~/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Connect to MongoDB
    const collection = await getCollection();

    // Retrieve unique years and months from the LMIA collection
    const quarters = await collection
      .aggregate([
        { $group: { _id: { year: { $year: "$time" }, month: { $month: "$time" } } } },
        { $sort: { "_id.year": -1, "_id.month": -1 } },
      ])
      .toArray();

    // Send the unique years and months as the API response
    res.status(200).json({ quarters: quarters.map((q) => q._id) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
