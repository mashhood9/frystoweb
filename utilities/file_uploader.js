const fs = require("fs");
const fsExtra = require('fs-extra');
const util = require("util");
const fsWriteFile = util.promisify(fs.writeFile);

class FileDownLoader {
    constructor() {

    }
    /**
     * 
     * @param {*} pathToDir path to the directory for saving
     * @param {*} filesObj = array of objects in following format
     * [{
     *  id : "name of the key defined in mongodb"
     *  filename: "name of the filename"
     * }]
     */
    async uploadFile(pathToDir, filesObj) {
        try {
            let arrFile = [];
            if(!Array.isArray(filesObj)) {
                arrFile.push(filesObj)
            } else {
                arrFile = filesObj
            }
            let filesPath = [];
            filesPath = await Promise.all(arrFile.map(async file => {
                fsExtra.ensureDir(pathToDir);
                let timestamp = new Date().getTime();
                const saveToDir = `${pathToDir}/${timestamp}-${file.name}`;
                fsWriteFile(saveToDir, file.data, "base64");               
                return `${timestamp}-${file.name}`;
            }));
            return filesPath;
        } catch (error) {
            throw error;
        }
    }

    /**
   * @description :: Remove images from server.
   * @param {String} imagePath path of the image
   * @returns void
   */
  async removeImages(imagePath) {
    try {
      fs.unlinkSync(`${global.appRootDirectory}${imagePath}`);
    } catch(err) {
      console.log(err);
      return Promise.reject(err);
    }
  }
}

module.exports = FileDownLoader;