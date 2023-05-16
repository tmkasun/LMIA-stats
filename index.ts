const { data } = require("./data/meta");
const { LMIA_DATA_DIR, getDataFiles, downloadFile } = require("./utils");
const Excel = require("exceljs");
const path = require("path");

import { addEntry } from "./data/mongo";
import ASqlite3, { Asqlite } from "./utils/sql";
const old2017To2021Pattern = /^(20\d\d)(\w\d)/;
const quartersMap: { [key: string]: string } = {
  q1: "March",
  q2: "June",
  q3: "September",
  q4: "December",
};

const downloadENStats = async () => {
  let enResources = 0;
  for (const resource of data.result.resources) {
    const { name, url } = resource;
    if (resource.language.length === 1 && resource.language.includes("en")) {
      enResources += 1;
      const latests = name.split(",").pop();
      const fileExtension = url.split(".").pop();
      let [from, to] = latests.split(" to ");
      if (to) {
        const year = to.split(" ").pop();
        from = `${from} ${year}`.trim();
        console.log(`${from} => ${to}`);
        const fileName = `${to}.${fileExtension}`.replaceAll(" ", "-");
        try {
          await downloadFile(url, path.join(LMIA_DATA_DIR, fileName));
        } catch (error) {
          console.error(`Error downloading ${fileName}`);
        }
        await new Promise((r) => setTimeout(() => r(null), 1000));
      } else {
        const a = name.split("-");
        const b = name.match(/20\d\d/);
        const [, year, quarter] = old2017To2021Pattern.exec(name) || [];
        if (quarter) {
          const qString = quartersMap[quarter.toLocaleLowerCase()];
          const fileName = `${qString} ${year}.${fileExtension}`.replaceAll(" ", "-");
          try {
            await downloadFile(url, path.join(LMIA_DATA_DIR, fileName));
          } catch (error) {
            console.error(`Error downloading ${fileName}`);
          }
        }
        debugger;
      }
    } else {
      console.log(resource.language.join(","));
    }
  }
  console.log(enResources);
};

const parseData = async () => {
  const dataFiles = await getDataFiles();
  const db = await initDB();
  for (const dataFile of dataFiles) {
    const filePath = path.join(LMIA_DATA_DIR, dataFile);
    const [fileName, fileExtension] = dataFile.split(".");

    console.log(`### Reading ${dataFile} ###`);
    const workbook = new Excel.Workbook();
    const isCSV = fileExtension.toLocaleLowerCase() === "csv";
    try {
      if (isCSV) {
        await workbook.csv.readFile(filePath);
      } else {
        await workbook.xlsx.readFile(filePath);
      }
    } catch (error) {
      console.log(`Failed ${dataFile}`);
      continue;
    }
    const [worksheet] = workbook.worksheets;
    let totalData = 0;
    const totalRows = worksheet.rowCount;
    let batchCount = 0;
    let batch: any = [];
    worksheet.eachRow(async (row: any) => {
      batchCount += 1;
      if (row.cellCount <= 2 || (!row.getCell(2).value && !row.getCell(3).value)) {
        console.warn(`None data row!`);
      } else {
        const cells: (string | number)[] = row._cells.map((c: any) =>
          typeof c.value === "string" ? c.value.trim().replace(/\'/g, "''") : c.value
        );
        let [
          province,
          programStream,
          employer,
          address,
          occupation,
          incorporateStatus,
          approvedLMIAs,
          approvedPositions,
        ] = cells;

        approvedLMIAs = approvedLMIAs !== undefined ? parseInt(approvedLMIAs as string) : -1;
        approvedPositions = approvedPositions !== undefined ? parseInt(approvedPositions as string) : -1;
        // For old LMIA stats
        const oldSchema = cells.length == 6;
        if (oldSchema) {
          approvedPositions = incorporateStatus;
          incorporateStatus = "";
        }
        if (address === "Address") {
          console.warn(`Suspicious data row => ${cells.join("<=>")}`);
          return;
        }
        // batch.push({
        //   province,
        //   programStream,
        //   employer,
        //   address,
        //   occupation,
        //   incorporateStatus,
        //   approvedLMIAs,
        //   approvedPositions,
        //   time: fileName,
        // });
        // if (batchCount % 10 === 0) {
        //   const res = await addEntry(batch);
        //   batch = [];
        // }
        await db.run(
          `
                    INSERT OR IGNORE INTO ${Asqlite.TABLE_NAME}
                        (
                            province,
                            programStream,
                            employer,
                            address,
                            occupation,
                            incorporateStatus,
                            approvedLMIAs,
                            approvedPositions,
                            time
                            )
                        VALUES(
                            '${province}',
                            '${programStream}',
                            '${employer}',
                            '${address}',
                            '${occupation}',
                            '${incorporateStatus}',
                            ${approvedLMIAs},
                            ${approvedPositions},
                            '${fileName}'
                             );
                    `
        );
        totalData += 1;
      }
    });
    console.log(`### End reading ${dataFile} ###`);
    console.log(`Total processed data = ${totalData}`);
  }
  console.log(`Closing DB!`);
  await db.close();
};

const initDB = async () => {
  const db = await ASqlite3.open(path.join("data", "allLMIAs.sql"));
  await db.run(`
    CREATE TABLE IF NOT EXISTS ${Asqlite.TABLE_NAME} (
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
    `);
  return db;
};

downloadENStats();
parseData();
