'use strict';
var express = require('express');
var router = express.Router();
let Signup = require('../../controllers/auth/signup_controller');


router.post('/', async (req, res) => {
    try {
        let signup = new Signup();        
        let response = await signup.createUser(req.body);
        res.send({success:true, response});
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