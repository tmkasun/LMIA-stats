import logger from "./utils/logger";
const { LMIA_DATA_DIR, getDataFiles, downloadFile, getLMIAMetaJSON } = require("./utils");
const Excel = require("exceljs");
const path = require("path");
const initMongo = require("./SyncMongo");
const Asqlite = require("./utils/sql");

const IS_CLOUD = true;

const old2017To2021Pattern = /^(20\d\d)(\w\d)/;

const quartersMap: { [key: string]: string } = {
  q1: "March",
  q2: "June",
  q3: "September",
  q4: "December",
};

const downloadENStats = async () => {
  let enResources = 0;
  const metaData = await getLMIAMetaJSON();
  for (const resource of metaData.resources) {
    const { name, url, language } = resource;
    if (language.length === 1 && language.includes("en")) {
      enResources += 1;
      const latests = name.split(",").pop();
      const fileExtension = url.split(".").pop();
      let [from, to] = latests.split(" to ");
      // If `to` is available it's a New kind of LMIA record
      if (to) {
        const year = to.split(" ").pop();
        from = `${from} ${year}`.trim();
        logger.info(`${from} => ${to}`);
        const fileName = `${to}.${fileExtension}`.replaceAll(" ", "-");
        try {
          await downloadFile(url, path.join(LMIA_DATA_DIR, fileName));
        } catch (error) {
          logger.error(`Error downloading ${fileName}`);
        }
        await new Promise((r) => setTimeout(() => r(null), 1000));
      } else {
        const [, year, quarter] = old2017To2021Pattern.exec(name) || [];
        if (quarter) {
          const qString = quartersMap[quarter.toLocaleLowerCase()];
          const fileName = `${qString} ${year}.${fileExtension}`.replaceAll(
            " ",
            "-"
          );
          try {
            await downloadFile(url, path.join(LMIA_DATA_DIR, fileName));
          } catch (error) {
            logger.error(`Error downloading ${fileName}`);
          }
        }
      }
    } else {
      logger.info(resource.language.join(","));
    }
  }
  logger.info(enResources);
};

const parseData = async () => {
  const dataFiles = await getDataFiles();
  const db = await initDB();
  let grandTotalValidData = 0;
  for (const dataFile of dataFiles) {
    const filePath = path.join(LMIA_DATA_DIR, dataFile);
    const [fileName, fileExtension] = dataFile.split(".");

    logger.info(`### Reading ${dataFile} ###`);
    const workbook = new Excel.Workbook();
    const isCSV = fileExtension.toLocaleLowerCase() === "csv";
    try {
      if (isCSV) {
        await workbook.csv.readFile(filePath);
      } else {
        await workbook.xlsx.readFile(filePath);
      }
    } catch (error) {
      logger.info(`Failed ${dataFile}`);
      continue;
    }
    const [worksheet] = workbook.worksheets;
    const totalRows = worksheet.rowCount;
    let totalData = 0;
    let batchCount = 0;
    let noDataRows = 0;
    let mongoErrors = 0;
    const mongoTasks: any[] = [];
    let batch: any = [];
    worksheet.eachRow(async (row: any) => {
      batchCount += 1;
      if (
        row.cellCount <= 2 ||
        (!row.getCell(2).value && !row.getCell(3).value)
      ) {
        noDataRows += 1;
        // logger.warn(`None data row!`);
      } else {
        const cells: (string | number)[] = row._cells.map((c: any) =>
          typeof c.value === "string"
            ? c.value.trim().replace(/\'/g, "''")
            : c.value
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

        approvedLMIAs =
          approvedLMIAs !== undefined ? parseInt(approvedLMIAs as string) : -1;
        approvedPositions =
          approvedPositions !== undefined
            ? parseInt(approvedPositions as string)
            : -1;
        // For old LMIA stats
        const oldSchema = cells.length == 6;
        if (oldSchema) {
          approvedPositions = incorporateStatus;
          incorporateStatus = "";
        }
        if (address === "Address") {
          logger.warn(`Suspicious data row => ${cells.join("<=>")}`);
          return;
        }
        if (IS_CLOUD) {
          const currentRecord = {
            province,
            programStream,
            employer,
            address,
            occupation,
            incorporateStatus,
            approvedLMIAs,
            approvedPositions,
            time: new Date(fileName),
          };
          // batch.push(currentRecord);
          try {
            mongoTasks.push(db.insertOne(currentRecord));
            // logger.info(
            //   `${insertManyResult.insertedCount} documents successfully inserted.\n`
            // );
          } catch (err) {
            mongoErrors += 1;
            logger.error(
              `Something went wrong trying to insert the new documents: ${err}\n`
            );
          }
        }
        if (batchCount % 100 === 0) {
          logger.info(`Processing batch ${batchCount} . . .`);
        }
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
        }
        totalData += 1;
      }
    });
    await Promise.allSettled(mongoTasks);
    logger.info(`### End reading ${dataFile} ###`);
    logger.info(`Total processed data = ${totalData}
    Total No Data Rows =  ${noDataRows}
    Total Mongo Errors = ${mongoErrors}
    `);
    grandTotalValidData += totalData;
  }
  logger.info(`Closing DB!`);
  // TODO:Check error db.close is not a function
  await db.close();
};

const initDB = async () => {
  if (IS_CLOUD) {
    return initMongo();
  }
  const db = await Asqlite.open(path.join("data", "allLMIAs.sql"));
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

// downloadENStats();
parseData();
