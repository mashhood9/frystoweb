'use strict';
var express = require('express');
var router = express.Router();
let Merchant_Signup = require('../../controllers/auth/merchant_signup_controller');


router.post('/', async (req, res) => {
    try {
        let signup = new Merchant_Signup();        
        let response = await signup.createUser(req.body);
        res.status(200).send({ success: true, token: response, message: 'Success', statusCode : 200 });
    } catch (error) {
        res.status(error.statusCode || 500).send(error.message);
    }
});

router.get('/get-otp', async (req, res) => {
    try {
        let signup = new Signup();        
        let response = await signup.getOTP(req.query);
        res.send({success:true, mobile_otp:response.mobile_otp});
    } catch (error) {
        res.status(error.statusCode || 500).send(error.message);
    }
});

module.exports = router;