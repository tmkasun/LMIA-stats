import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { JSDOM } from "jsdom";
// import { response } from './data/mock.response';

type ResponseData = {
    data: any[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    const response = await axios.get(
        "https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/employers-non-compliant.html",
    );
    const dom = new JSDOM(response.data);
    const dataTable = dom.window.document.querySelectorAll("#table1 tbody tr");
    const allRecords = [];
    for (const tr of dataTable) {
        const data = {
            operatingName: tr.childNodes[1].textContent?.trim(),
            legalName: tr.childNodes[3].textContent?.trim(),
            address: tr.childNodes[5].textContent?.trim(),
            reason: tr.childNodes[7].textContent?.trim(),
            finalDecision: tr.childNodes[9].textContent?.trim(),
            penalty: tr.childNodes[11].textContent?.trim(),
            status: tr.childNodes[13].textContent?.trim(),
        };
        allRecords.push(data);
    }
    res.status(200).json({ data: allRecords });
}
