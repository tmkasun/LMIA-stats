const fs = require("fs");
const axios = require("axios");
import logger from "./logger";
import mockNegative from '../data/mockNegativeLMIAs'

const LMIA_DATA_DIR = "data/lmia";
const NEGATIVE_LMIA_DATA_DIR = "data/negative_lmia";

const downloadFile = (url: string, filePath: string) => {
  const isExist = fs.existsSync(filePath);
  if (!isExist) {
    logger.info(`Downloading ${filePath}`);
    return axios({
      url,
      responseType: "stream",
    }).then(
      (response: any) =>
        new Promise((resolve, reject) => {
          response.data
            .pipe(fs.createWriteStream(filePath))
            .on("finish", () => resolve(true))
            .on("error", (e: Error) => reject(e));
        })
    );
  } else {
    logger.warn(`Skip downloading ${filePath} already exist!`);
  }
};

const getDataFiles = async (dir = LMIA_DATA_DIR) => {
  const files = await fs.promises.readdir(dir);
  return files;
};
const getMetaDataJSON = async () => {
  // const res = await axios('https://open.canada.ca/data/api/action/package_show?id=f82f66f2-a22b-4511-bccf-e1d74db39ae5');
  // return res.data;
  return mockNegative
}
module.exports = {
  LMIA_DATA_DIR,
  NEGATIVE_LMIA_DATA_DIR,
  getDataFiles,
  downloadFile,
  getMetaDataJSON
};