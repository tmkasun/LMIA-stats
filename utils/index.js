const fs = require('fs');
const axios = require('axios');

const LMIA_DATA_DIR = 'data/lmia';

const downloadFile = (url, filePath) =>
    axios({
        url,
        responseType: 'stream',
    }).then(
        response =>
            new Promise((resolve, reject) => {
                response.data
                    .pipe(fs.createWriteStream(filePath))
                    .on('finish', () => resolve())
                    .on('error', e => reject(e));
            }),
    );

const getDataFiles = async () => {
    const files = await fs.promises.readdir(LMIA_DATA_DIR);
    return files;

}
module.exports = {
    LMIA_DATA_DIR,
    getDataFiles,
    downloadFile
};