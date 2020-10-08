const express = require('express');
const router = express.Router();
let authToken = require('../../utilities/jwt.auth');
let crypto = require('../../utilities/crypto');
const log_collections = require('../../db/config').mongo_config.log_collections;

// Refresh token
router.post('/', async (req, res) => {
    try {
        let refreshToken = null;
        let jwt_token = null;
 
        if(req.body){
            jwt_token = await  authToken.encrypt({
                 user_id: req.body.user_id,
                 email: req.body.email,
                 user_role: req.body.user_role,
                 broker_id: parseInt(req.body.broker_id) 
             }); 
            refreshToken =  await crypto.encrypt(jwt_token);

            let data = {
                token: refreshToken
            }
            res.send({success: true, message: 'Success', data: data});
        }
        else{
            throw new CustomError('Invalid Token', 400, 'Refresh Token');
        }
        
    } catch (error) {
        res.status(error.statusCode || 500).send({success:false, message: error.message, token: null});
    }
 });

 module.exports = router;