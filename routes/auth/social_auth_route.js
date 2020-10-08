'use strict';
var express = require('express');
var router = express.Router();
const passport = require('passport');
const Login = require('../../controllers/auth/login_controller');

const successRedirect = async(req, res) => { //common route handler for social logins
    // let redirect = '/';
    try{
        let redirect = process.env.SOCIAL_AUTH_REDIRECT_URL;
        let token = JSON.parse(JSON.stringify(req.user.token));
        // Append network details like ip address etc to existing object
    
        // if(req.query.state){
        //     req.user.network_details = JSON.parse(req.query.state);
        // }
        // else{
        //     req.user.network_details = req.session.state;
        // };
    
        // req.user.network_details = {
        //     ip_address: req.body.ip
        // };
        
        let login = new Login();
        // Store login history details
        await login.storeLoginDetails(req.user);
        res.redirect(`${redirect}auth/callback?user=${token}`);
    } catch(error){
        throw error;
    }
    
}

const passportLoginHandler =  (req, res, next) => {
    let options = {}
    let provider = req.params.provider;

    if (provider === "google") {
        options = { scope: ['profile', 'email'], prompt: 'consent', accessType: 'offline'}
    }
    if (provider === "facebook") {
        options = { scope: ['email'] }
    }
    // req.session.state = JSON.parse(req.query.q);
    // options.state = req.query.q;
    passport.authenticate(provider, options)(req, res, next)
}

const passportRedirectHandler = (req, res, next) => {

    try {
        let provider = req.params.provider
    let options = { failureRedirect: `${process.env.SOCIAL_AUTH_REDIRECT_URL}/auth/login` }
    passport.authenticate(provider, options)(req, res, next)
    } catch (error) {
        throw error;
    }
    
}

router.get('/:provider', passportLoginHandler);
router.get('/:provider/callback', passportRedirectHandler, successRedirect);

module.exports = router;
