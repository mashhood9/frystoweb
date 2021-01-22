'use strict';
var express = require('express');
var router = express.Router();
let Order_Cycle = require('../../controllers/order_cycle_controller/order_cycle_controller');


router.post('/addorder-onlinepay', async (req, res) => {
    try {
        let  order = new Order_Cycle();        
        let response = await order.addOrderOnline(req.body);
        res.send({success:true, response});
    } catch (error) {
        res.status(error.statusCode || 500).send(error.message);
    }
});

router.post('/addorder-codpay', async (req, res) => {
    try {
        let  order = new Order_Cycle();        
        let response = await order.addOrderCOD(req.body);
        res.send({success:true, response});
    } catch (error) {
        res.status(error.statusCode || 500).send(error.message);
    }
});



router.post('/addreturnorder', async (req, res) => {
    try {
        let order = new Order_Cycle();        
        let response = await order.addReturnOrder(req.body);
        res.send({success:true, response});
    } catch (error) {
        res.status(error.statusCode || 500).send(error.message);
    }
});





router.get("/order/by_user_id", async (req, res) => {
    try {
        let adminController = new Order_Cycle();
        let user_id = req.query.user_id || 0;
        let response = await adminController.getOrderByUserId(user_id);
        res.send({ success : true, data: response, message: 'Master list successfully' });
    } catch (error) {
        res.status(error.statusCode || 500).send({ success: false, message: error.message });
    }
  });
router.get("/order/by_user_id/list_item/", async (req, res) => {
    try {
        let adminController = new Order_Cycle();
        let order_id = req.query.order_id || 0;
        let response = await adminController. getOrderListByUserId(order_id);
        res.send({ success : true, data: response, message: 'Master list successfully' });
    } catch (error) {
        res.status(error.statusCode || 500).send({ success: false, message: error.message });
    }
  });
  
  router.get("/order/by_user_id/return_list_item/", async (req, res) => {
    try {
        let adminController = new Order_Cycle();
        let order_id = req.query.order_id || 0;
        let response = await adminController.getReturnOrderListByUserId(order_id);
        res.send({ success : true, data: response, message: 'Return Item list successfully' });
    } catch (error) {
        res.status(error.statusCode || 500).send({ success: false, message: error.message });
    }
  });

  router.get("/order/by_merchant_id", async (req, res) => {
    try {
        let adminController = new Order_Cycle();
        let merchant_id = req.query.merchant_id || 0;
        let response = await adminController.getOrderByMerchantId(merchant_id);
        res.send({ success : true, data: response, message: 'order list successfully' });
    } catch (error) {
        res.status(error.statusCode || 500).send({ success: false, message: error.message });
    }
  });

  router.get("/order/to_deliver_by_merchant_id", async (req, res) => {
    try {
        let adminController = new Order_Cycle();
        let merchant_id = req.query.merchant_id || 0;
        let response = await adminController.getToDeliverOrderByMerchantId(merchant_id);
        res.send({ success : true, data: response, message: 'order list successfully' });
    } catch (error) {
        res.status(error.statusCode || 500).send({ success: false, message: error.message });
    }
  });



  router.get("/order_settelment/by_merchant_id", async (req, res) => {
    try {
        let adminController = new Order_Cycle();
        let merchant_id = req.query.merchant_id || 0;
        let response = await adminController.getOrderSettelmentStatusByMerchantId(merchant_id);
        res.send({ success : true, data: response, message: 'order list successfully' });
    } catch (error) {
        res.status(error.statusCode || 500).send({ success: false, message: error.message });
    }
  });
 router.get("/order/pending_order_merchant_id", async (req, res) => {
    try {
        let adminController = new Order_Cycle();
        let merchant_id = req.query.merchant_id || 0;
        let response = await adminController.pendingOrderByMerchantId(merchant_id);
        res.send({ success : true, data: response, message: 'Master list successfully' });
    } catch (error) {
        res.status(error.statusCode || 500).send({ success: false, message: error.message });
    }
  });

router.post('/order/order_status', async (req, res) => {
    try {
        let order = new Order_Cycle();        
        let response = await order.orderstatusbyMerchant(req.body);
        res.send({success:true, response});
    } catch (error) {
        res.status(error.statusCode || 500).send(error.message);
    }
});

router.post('/online-order/pyment-confirm', async (req, res) => {
    try {
        let order = new Order_Cycle();        
        let response = await order.orderonlinepaymentconfirmation(req.body);
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
