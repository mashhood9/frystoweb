'use strict';
var express = require('express');
var router = express.Router();
let Merchant_Data = require('../../controllers/merchant_data_controller/merchant_data_controller');


router.post('/add_merchant_list_detail', async (req, res) => {
    try {
        let order = new Merchant_Data();        
        let response = await order.add_merchant_detail(req.body);
        res.send({success:true, response});
    } catch (error) {
        res.status(error.statusCode || 500).send({error:error.message});
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