'use strict';
var express = require('express');
var router = express.Router();
let Product_List = require('../../controllers/product_list_controller/product_list');


router.post('/add_product_list_detail', async (req, res) => {
    try {
        let order = new Product_List();        
        let response = await order.add_product_list(req.body);
        res.send({success:true, response});
    } catch (error) {
        res.status(error.statusCode || 500).send({error:error.message});
    }
});

router.post('/add_onboard_list', async (req, res) => {
    try {
        let order = new Product_List();        
        let response = await order.onboard_list(req.body);
        res.send({success:true, response});
    } catch (error) {
        res.status(error.statusCode || 500).send({error:error.message});
    }
});

router.get("/product-list", async (req, res) => {
    try {
        let adminController = new Product_List();
        let merchant_frysto_id = req.query.merchant_frysto_id || 0;
        let response = await adminController.getProductListMerchant(merchant_frysto_id);
        res.send({ success : true, data: response, message: 'Product list successfully' });
    } catch (error) {
        res.status(error.statusCode || 500).send({ success: false, message: error.message });
    }
  });

  router.get("/carousellist", async (req, res) => {
    try {
        let adminController = new Product_List();
        let response = await adminController.getCarouselImage();
        res.send({ success : true, data_image: response, message: 'Carousel list successfully' });
    } catch (error) {
        res.status(error.statusCode || 500).send({ success: false, message: error.message });
    }
  });


  router.get("/productavalaibleupdate", async (req, res) => {
    try {
        let adminController = new Product_List();
        let productId = req.query.product_id || 0;
        let status = req.query.status;
        let response = await adminController.productAvailabilityUpdate(productId, status);
        res.send({ success : true, data: response, message: 'Product list successfully' });
    } catch (error) {
        res.status(error.statusCode || 500).send({ success: false, message: error.message });
    }
  });

router.post('/update_product_price', async (req, res) => {
    try {
        let order = new Product_List();        
        let response = await order.price_update(req.body);
        res.send({success:true, response});
    } catch (error) {
        res.status(error.statusCode || 500).send({error:error.message});
    }
});

router.get("/customer_app/product-list", async (req, res) => {
    try {
        let adminController = new Product_List();
        let merchant_frysto_id = req.query.merchant_frysto_id ;
        let response = await adminController.getProductListCustomer(merchant_frysto_id);
//         res.send({ success : true, data: response, message: 'Product list successfully' });
        res.send(response);
    } catch (error) {
        res.status(error.statusCode || 500).send({ success: false, message: error.message });
    }
  });


module.exports = router;
