const jwt = require('jsonwebtoken');
const secretKey = 'harrypotter@2406';
const options = { expiresIn: "24h" };

let encrypt = (user) => {
    return jwt.sign({
        data: user
      }, secretKey, 
                    options
                   )
}

let verifyToken = (authToken) => {
    try {
        return jwt.verify(authToken, secretKey, options);
    } catch (error) {
        //res.sendStatus(403);    
    }
}

module.exports = {
    encrypt, verifyToken
}
