import logger from "./utils/logger";
const { data } = require("./data/meta");
const { NEGATIVE_LMIA_DATA_DIR, getDataFiles, getMetaDataJSON, downloadFile } = require("./utils");
const Excel = require("exceljs");
var XLSX = require("xlsx");
const path = require("path");
const initMongo = require("./SyncMongo");
const Asqlite = require("./utils/sql");

const IS_CLOUD = true;

const newPattern = /^(\d+)Q(\d)/i;
const oldPattern = /^(\d+)-/i;

const quartersMap: { [key: string]: string } = {
  q1: "March",
  q2: "June",
  q3: "September",
  q4: "December",
};

const downloadENStats = async () => {
  let enResources = 0;
  const data = await getMetaDataJSON();
  let total = 0;
  let matched = 0;
  for (const resource of data.result.resources) {
    const { name, url, language, format } = resource;
    if (language.length === 1 && language.includes("en")) {
      total++;
      let year, quarter;
      if (name.match(newPattern)) {
        const match = name.match(newPattern);
        [, year, quarter] = match
        quarter = quartersMap[`q${quarter}`]
        matched++;
      } else if (name.match(oldPattern)) {
        const match = name.match(oldPattern);
        [, year] = match
        quarter = quartersMap.q4;

      } else {
        logger.warn(`Error parsing file name ${name} === \n\n\n`);
      }
      logger.info(`Year = ${year} quarter = ${quarter}`);
      const fileName = `${quarter}-${year}.${format.toLowerCase()}`.replaceAll(" ", "-");
      try {
        await downloadFile(url, path.join(NEGATIVE_LMIA_DATA_DIR, fileName));
      } catch (error) {
        logger.error(`Error downloading ${fileName}`);
      }
      await new Promise((r) => setTimeout(() => r(null), 1000));
    } else {
      logger.warn(resource.language.join(","));
    }
  }
  logger.info(`Total = ${total} downloaded!`)
};

const provinces = [
  "newfoundland and labrador",
  "prince edward island",
  "nova scotia",
  "new brunswick",
  "quebec",
  "ontario",
  "manitoba",
  "saskatchewan",
  "alberta",
  "british columbia",
  "yukon",
  "outside canada",
  "northwest territories",
  "nunavut"
]


const insertData = async (dataRow: any, db: any) => {
  let {
    province,
    programStream,
    employer,
    address,
    occupation,
    incorporateStatus,
    requestedLMIAs,
    requestedPositions,
    fileName } = dataRow;

  requestedLMIAs =
    requestedLMIAs !== undefined ? parseInt(requestedLMIAs as string) : -1;
  requestedPositions =
    requestedPositions !== undefined
      ? parseInt(requestedPositions as string)
      : -1;
  if (!IS_CLOUD) {
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
                                  requestedLMIAs,
                                  requestedPositions,
                                  time
                                  )
                              VALUES(
                                  '${province}',
                                  '${programStream}',
                                  '${employer}',
                                  '${address}',
                                  '${occupation}',
                                  '${incorporateStatus}',
                                  ${requestedLMIAs},
                                  ${requestedPositions},
                                  '${fileName}'
                                   );
                          `
    );
  } else {
    const currentRecord = {
      province,
      programStream,
      employer,
      address,
      occupation,
      incorporateStatus,
      approvedLMIAs: requestedLMIAs,
      approvedPositions: requestedPositions,
      isNegative: true,
      time: new Date(fileName),
    };
    try {
      await db.insertOne(currentRecord);
    } catch (err) {
      logger.error(
        `Something went wrong trying to insert the new documents: ${err}\n`
      );
    }
  }
}

const parseData = async () => {
  const dataFiles = await getDataFiles(NEGATIVE_LMIA_DATA_DIR);
  const db = await initDB();
  let grandTotalValidData = 0;
  for (const dataFile of dataFiles) {
    const filePath = path.join(NEGATIVE_LMIA_DATA_DIR, dataFile);
    const [fileName, fileExtension] = dataFile.split(".");

    logger.info(`### Reading ${dataFile} ###`);
    const workbook = new Excel.Workbook();
    const isCSV = fileExtension.toLocaleLowerCase() === "csv";
    const parsedData = XLSX.readFile(filePath);
    const dataSheet = parsedData.Sheets[parsedData.SheetNames[0]]
    let rowCount = 0;
    let validDataCount = 0;
    let currentProvince = '';
    for (let dataRow of XLSX.utils.sheet_to_json(dataSheet, { header: 1, raw: true })) {
      rowCount++;
      if ((dataRow.length < 1) || (rowCount === 1)) {
        continue
      }
      if (dataRow.length === 1 && provinces.includes(dataRow[0].trim().toLowerCase())) {
        currentProvince = dataRow[0];
        continue;
      } else if (dataRow.length === 1) {
        logger.error(`unknown province name ${dataRow[0]}`)
      }
      let
        province = currentProvince,
        programStream = 'Unknown',
        employer,
        address,
        occupation = 'Unknown',
        incorporateStatus = 'Unknown',
        requestedLMIAs: number | string = '-1',
        requestedPositions: number | string = '-1'
      if (dataRow.length === 3) {
        [employer, address, requestedPositions] = dataRow.map((data: any) =>
          typeof data === "string"
            ? data.trim().replace(/\'/g, "''")
            : data);
        if (employer.toLowerCase() === 'employer') {
          logger.warn(`Header row detected ${dataRow}`);
          continue
        }
        validDataCount++;
        await insertData({ province, programStream, employer, address, occupation, incorporateStatus, requestedLMIAs, requestedPositions, fileName }, db);
      } else if (dataRow.length === 5) {
        if (dataRow[0] && provinces.includes(dataRow[0].trim().toLowerCase())) {
          currentProvince = dataRow[0];
        } else {
          logger.debug(`Unknown data row ${dataRow} could be a header!`)
        }
        [province = currentProvince, employer, address, occupation, requestedPositions] = dataRow.map((data: any) =>
          typeof data === "string"
            ? data.trim().replace(/\'/g, "''")
            : data);
        if (!employer || typeof employer !== 'string') {
          employer = 'Unknown';
          logger.warn(`No employer name available in the data ${dataRow}`)
        }
        if (employer.toLowerCase() === 'employer') {
          logger.warn(`Header row detected ${dataRow}`);
          continue
        }
        validDataCount++;

        await insertData({ province, programStream, employer, address, occupation, incorporateStatus, requestedLMIAs, requestedPositions, fileName }, db);

      } else if (dataRow.length === 6) {
        [province, programStream, employer, address, occupation, requestedPositions] = dataRow.map((data: any) =>
          typeof data === "string"
            ? data.trim().replace(/\'/g, "''")
            : data);
        if (!employer || typeof employer !== 'string') {
          employer = 'Unknown';
          logger.warn(`No employer name available in the data ${dataRow}`)
        }
        if (employer.toLowerCase() === 'employer') {
          logger.warn(`Header row detected ${dataRow}`);
          continue
        }
        await insertData({ province, programStream, employer, address, occupation, incorporateStatus, requestedLMIAs, requestedPositions, fileName }, db);

      } else if (dataRow.length === 8) {
        [province, programStream, employer, address, occupation, incorporateStatus, requestedLMIAs, requestedPositions] = dataRow.map((data: any) =>
          typeof data === "string"
            ? data.trim().replace(/\'/g, "''")
            : data);
        if (!employer || typeof employer !== 'string') {
          employer = 'Unknown';
          logger.warn(`No employer name available in the data ${dataRow}`)
        }
        if (employer.toLowerCase() === 'employer') {
          logger.warn(`Header row detected ${dataRow}`);
          continue
        }
        await insertData({ province, programStream, employer, address, occupation, incorporateStatus, requestedLMIAs, requestedPositions, fileName }, db);
      } else {
        logger.error(`Suspicious data row ${dataRow}`)
      }
    }
    logger.info(`Processing ${fileName} is completed!\nData rows = ${rowCount} valid data = ${validDataCount}`);
  }
  logger.info(`Closing DB!`);
  await db.close();
};

const initDB = async () => {
  if (IS_CLOUD) {
    return initMongo();
  }
  const db = await Asqlite.open(path.join("data", "negativeLMIAs.sql"));
  await db.run(`
    CREATE TABLE IF NOT EXISTS ${Asqlite.TABLE_NAME} (
        province TEXT NOT NULL,
        programStream TEXT NOT NULL,
        employer TEXT NOT NULL,
        address TEXT NOT NULL,
        occupation TEXT NOT NULL,
        incorporateStatus TEXT,
        requestedLMIAs INTEGER,
        requestedPositions INTEGER,
        time TEXT
        )
    `);
  return db;
};

// downloadENStats();
parseData();


// Province/Territory,	Program Stream,	Employer,	Address,	Occupation,	Incorporate Status,	Requested LMIAs,	Requested Positions,	