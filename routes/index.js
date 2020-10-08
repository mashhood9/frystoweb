const express = require('express');
const router = express.Router();
const authToken = require('../utilities/jwt.auth');
const crypto = require('../utilities/crypto');
 const authRouter = require('./auth/index');
 const orderRouter =require('./order/order_detail')
 const merchantDataRouter =require('./merchant/merchant_detail')
 const productList= require('./product_list/product_list_route')
const socialAuthRouter = require('./auth/social_auth_route');
const userRouter = require('./user/user_route');
const refreshTokenRouter = require('./refresh-token/index');
let adminRouter = require('./admin/admin_route');
const {mongo_config} = require("../db/config");
const mongoClient = require("../db/mongo_connection");
const {broker_settings} = mongo_config.collections;
router.get('/test', async (req, res) => {
    res.send('working fine');
});
router.use('/auth', authRouter);
router.use('/social-auth', socialAuthRouter);
router.use('/order', orderRouter);
router.use('/merchant-list', merchantDataRouter);
router.use('/product_list', productList);



// Token verification logic
/*router.use(async (req, res, next) => {
    let response;
    const host = req.hostname;
    try {
        let crypto_decrypted_token = await crypto.decrypt(
            req.headers.authorization
        );
        response = await authToken.verifyToken(crypto_decrypted_token);
    } catch (error) {
        console.log(error);
    }

    if (response) {
        req.body.user_id = response.data.user_id;
        req.body.user_role = response.data.user_role;
    }
    else {
        res.status(401).send({ success: false, message: "Token has been expired.", token: null });
        return;
    };
    next();
});*/

// Refresh token
router.use('/refresh-token', refreshTokenRouter);
router.use('/user', userRouter);
router.use('/admin', adminRouter);

module.exports = router;
