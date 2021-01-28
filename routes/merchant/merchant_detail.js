'use strict';
var express = require('express');
var router = express.Router();
let Merchant_Data = require('../../controllers/merchant_data_controller/merchant_data_controller');


router.post('/add_merchant_detail', async (req, res) => {
    try {
        let order = new Merchant_Data();        
        let response = await order.add_merchant_detail(req.body);
        res.send({success:true, response});
    } catch (error) {
        res.status(error.statusCode || 500).send({error:error.message});
    }
});

router.post('/merchant_query', async (req, res) => {
    try {
        let order = new Merchant_Data();        
        let response = await order.merchant_query(req.body);
        res.send({success:true, response});
    } catch (error) {
        res.status(error.statusCode || 500).send({error:error.message});
    }
});


router.post('/merchant_login', async (req, res) => {
    try {
        let login = new Merchant_Data();
        let response = await login.merchant_authentication(req.body);
         res.status(200).send({ success: true, token: response, message: 'Success', statusCode : 200 });
    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message, statusCode: error.statusCode || 500});
    }
});

router.post('/merchant_signin_verify', async (req, res) => {
    try {
        let login = new Merchant_Data();
        let response = await login.merchant_verifyOTP(req.body);
         res.status(200).send({ success: true, token: response, message: 'Success', statusCode : 200 });
    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message, statusCode: error.statusCode || 500});
    }
});

router.get("/list/by_lat_lang", async (req, res) => {
    try {
        let adminController = new Merchant_Data();
        let user_latitude = req.query.user_latitude || 0;
        let user_longitude = req.query.user_langitude || 0;


        let response = await adminController.getListByPosition(user_latitude ,user_longitude);
        res.send({ success : true, data: response, message: 'merchant list successfully' });
    } catch (error) {
        res.status(error.statusCode || 500).send({ success: false, message: error.message });
    }
  });

  router.get("/user/user_id", async (req, res) => {
    try {
        let adminController = new Merchant_Data();
        let UserId = req.query.user_id || 0;
        let response = await adminController.getUserByUserId(UserId);
        res.send({ success : true, data: response, message: 'Use data successfully' });
    } catch (error) {
        res.status(error.statusCode || 500).send({ success: false, message: error.message });
    }
  });
  router.get("/fullmerchantdata", async (req, res) => {
    try {
        let adminController = new Merchant_Data();
        let MerchantId = req.query.merchant_frysto_id || 0;
        let response = await adminController.getFullMerchantDataByMerchantId(MerchantId);
        res.send({ success : true, data: response, message: 'Use data successfully' });
    } catch (error) {
        res.status(error.statusCode || 500).send({ success: false, message: error.message });
    }
  });

  router.get("/merchant/merchant_id", async (req, res) => {
    try {
        let adminController = new Merchant_Data();
        let MerchantId = req.query.merchant_frysto_id || 0;
        let response = await adminController.getMerchantByMerchantId(MerchantId);
        res.send({ success : true, merchant_data: response, message: 'Merchant data successfully' });
    } catch (error) {
        res.status(error.statusCode || 500).send({ success: false, message: error.message });
    }
  });

router.get("/master/master_product_list", async (req, res) => {
    try {
        let adminController = new Merchant_Data();
        let MerchantId = req.query.merchant_frysto_id || 0;
        let response = await adminController.getMasterProductList(MerchantId);
        res.send({ success : true, merchant_data: response, message: 'Merchant data successfully' });
    } catch (error) {
        res.status(error.statusCode || 500).send({ success: false, message: error.message });
    }
  });




  router.get("/order/by_merchant_id", async (req, res) => {
    try {
        let adminController = new Order_Cycle();
        let merchant_id = req.query.merchant_id || 0;
        let response = await adminController.getOrderByMerchantId(merchant_id);
        res.send({ success : true, data: response, message: 'Master list successfully' });
    } catch (error) {
        res.status(error.statusCode || 500).send({ success: false, message: error.message });
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
