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

router.get("/product-list", async (req, res) => {
    try {
        let adminController = new Product_List();
        let merchant_frysto_id = req.query.merchant_frysto_id || 0;
        let response = await adminController.getProductList(merchant_frysto_id);
        res.send({ success : true, data: response, message: 'Master list successfully' });
    } catch (error) {
        res.status(error.statusCode || 500).send({ success: false, message: error.message });
    }
  });



module.exports = router;