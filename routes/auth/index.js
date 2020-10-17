"use strict";
const express = require("express");
const router = express.Router();
const signupRouter = require('./signup_route');
const merchant_signupRouter = require('./merchant_signup_route');
const Login = require('../../controllers/auth/login_controller');
const Merchant_Login = require('../../controllers/auth/merchant_login_controller');
const ResetPwd = require('../../controllers/auth/reset_pwd_controller');


router.use('/signup', signupRouter);
router.use('/merchant_signup', merchant_signupRouter )

router.post('/signin', async (req, res) => {
    try {
        let login = new Login();
        let response = await login.signin(req.body);
         res.status(200).send({ success: true, token: response, message: 'Success', statusCode : 200 });
    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message, statusCode: error.statusCode || 500});
    }
});
router.post('/signin/verify', async (req, res) => {
    try {
        let login = new Login();
        let response = await login.veryfyOTP(req.body);
         res.status(200).send({ success: true, token: response, message: 'Success', statusCode : 200 });
    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message, statusCode: error.statusCode || 500});
    }
});
router.post('/merchant_signin', async (req, res) => {
    try {
        let login = new Merchant_Login();
        let token = await login.signin(req.body);
         res.status(200).send({ success: true, token, message: 'Success', statusCode : 200 });
    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message, statusCode: error.statusCode || 500});
    }
});

router.post('/forgot-password', async (req, res) => {
    try {
        let resetPassword = new ResetPwd(req.body);
        const response = await resetPassword.forgotPwd(req.body.forgot_pwd_mobile_obj);
        res.status(200).send({ success: true, data: 'token sent at this number' + '' + response.mobile_number, message: 'Success', statusCode : 200 });
    } catch (error) {
        res.status(error.statusCode || 500).send({ success: false, message: error.message, statusCode: error.statusCode || 500});
    }
});

router.post('/verify-token', async (req, res) => {
    try {
        let login = new Login();
        let response = await login.verifyToken(req.body);
        res.status(200).send({ isValid: response });
    } catch (error) {
        res.status(error.statusCode || 500).send({ isValid: false });
    }
});

router.post('/verify-reset-password-token', async (req, res) => {
    try {
        let resetPassword = new ResetPwd(req.body);
        let response = await resetPassword.verifyResetPwdToken(req.body);
        res.status(200).send({ isValid: response });
    } catch (error) {
        res.status(error.statusCode || 500).send({ isValid: false, error: error });
    }
});

router.post('/verify-mobile', async (req, res) => {
    try {
        let login = new Login();
        let response = await login.verifyMobileNumber(req.body);
        res.status(200).send({ isValid: response });
    } catch (error) {
        res.status(error.statusCode || 500).send({ isValid: false });
    }
});

router.post('/reset-password', async (req, res) => {
    try {
        let resetPassword = new ResetPwd(req.body);
        let response = await resetPassword.resetPwd(req.body.reset_pwd_obj);
        res.status(200).send({ success: response });
    } catch (error) {
        res.status(error.statusCode || 500).send({ success: false });
    }
});

router.post('/duplicate-mobile', async (req, res) => {
    try {
        let login = new Login();
        let response = await login.checkDuplicateMobileNubmer(req.body);
        res.status(200).send({ success: true, data: response, statusCode : 200,  message: 'Success' });
    } catch (error) {
        res.status(error.statusCode || 500).send({ success: false, message: error.message, statusCode: error.statusCode || 500});
    }
});

router.get('/get-token', async (req, res) => {
    try {
        let resetPassword = new ResetPwd(req.body);   
        let response = await resetPassword.getForgotToken(req.query);
        res.send({success:true, token:response.reset_password_token.token});
    } catch (error) {
        res.status(error.statusCode || 500).send(error.message);
    }
});

module.exports = router;
