const fsExtra = require('fs-extra');
const jimp = require('jimp');

let saveImg = async (folderPath, imgName, imageUrl) =>{
    try {
        // Check whether folder exists or not
        const finalPath = global.appRootDirectory + folderPath;
        await fsExtra.ensureDir(finalPath);
        // Save thumbnail
        let thumbnail = null;
        if (imageUrl.indexOf(';base64,') != -1) {
            thumbnail = await jimp.read(Buffer.from(imageUrl.replace(/^data:image\/png;base64,/, ""), 'base64'));
        } else {
            // handle as Buffer, etc..
            thumbnail = await jimp.read(imageUrl);
        }        
        thumbnail.resize(400, 400).quality(60).write(`${finalPath}/${imgName}.png`);
        thumbnail.resize(35 ,35).quality(60).write(`${finalPath}/${imgName}_thumbnail.png`);
        WinstonLogger.info({ message: "Image uploaded successfully", collection_name: "systemlogs" });
        return `${imgName}.png`;
    } catch (err) {
        console.log(err);
        
        WinstonLogger.error({ message: err, collectionName: "systemlogs"});
    }
}

module.exports = {
    saveImg
}