const fs = require("fs");
const axios = require("axios");
import logger from "./logger";

const LMIA_DATA_DIR = "data/lmia";

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

const getDataFiles = async () => {
  const files = await fs.promises.readdir(LMIA_DATA_DIR);
  return files;
};
module.exports = {
  LMIA_DATA_DIR,
  getDataFiles,
  downloadFile,
};
