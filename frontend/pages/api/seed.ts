import { db } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from "next";
import Asqlite from "../../../dataExtractor/utils/sql";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const client = await db.connect();

  try {
    await client.sql`
    CREATE TABLE ${Asqlite.TABLE_NAME} (
        province TEXT NOT NULL,
        programStream TEXT NOT NULL,
        employer TEXT NOT NULL,
        address TEXT NOT NULL,
        occupation TEXT NOT NULL,
        incorporateStatus TEXT,
        approvedLMIAs INTEGER,
        approvedPositions INTEGER,
        time TEXT
        )
    `;
    // const names = ['Fiona', 'Lucy'];
    // await client.sql`INSERT INTO Pets (Name, Owner) VALUES (${names[0]}, ${names[1]});`;
  } catch (error) {
    return response.status(500).json({ error });
  }

  //   const pets = await client.sql`SELECT * FROM Pets;`;
  return response.status(200).json({ pets: "ok" });
}
