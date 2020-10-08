const crypto = require('crypto');
const password = process.env.ENCRYPTION_PASSWORD;
const encryption_type = process.env.ENCRYPTION_TYPE;
// const key = crypto.randomBytes(16);
const iv = crypto.randomBytes(16);
const key = crypto.pbkdf2Sync('prancypoodle', 'sherylcrowe', 10000, 16, 'sha512');

// let encrypt = (jwtToken) => {
//     const encrypt_key = crypto.createCipher(encryption_type, password);
//     let encrypted_token = encrypt_key.update(jwtToken, 'utf8', 'hex') + encrypt_key.final('hex');
//         return encrypted_token;
// }

// let decrypt = (encryptedToken) => {
//     const decrypt_key = crypto.createDecipher(encryption_type, password);
//     let decrypted_token = decrypt_key.update(encryptedToken, 'hex', 'utf8') + decrypt_key.final('utf8');
//     return decrypted_token;
// }

let encrypt = (jwtToken) => {
    let cipher = crypto.createCipheriv(encryption_type, Buffer.from(key), iv);
    let encrypted = cipher.update(jwtToken);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    // return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

let decrypt = (encryptedToken) => {
    // let iv = Buffer.from(encryptedToken.iv, 'hex');
    // let encryptedText = Buffer.from(encryptedToken.encryptedData, 'hex');
    let textParts = encryptedToken.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv(encryption_type, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

module.exports = {
    encrypt, decrypt
}