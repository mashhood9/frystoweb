'use strict';
var express = require('express');
var router = express.Router();
let Order_Admin=require('../../controllers/order_admin/order_controller');

router.get('/orders', async(req,res) =>{
    try{
        let order = new Order_Admin();
        let id = req.query.id;
        let response = await order.getAllOrder();
        res.send({success:true, data:response, message:'orders list'});
    }catch(error){
        res.status(error.statusCode || 500).send(error.message);
    }

});
router.get('/orders_to_refund', async(req,res) =>{
    try{
        let order = new Order_Admin();
        let id = req.query.id;
        let response = await order.getAllOnlineOrderToRefund();
        res.send({success:true, data:response, message:'orders list'});
    }catch(error){
        res.status(error.statusCode || 500).send(error.message);
    }

});

router.get('/vn/v65/axbtydfr/orders_to settel', async(req,res) =>{
    try{
        let order = new Order_Admin();
        let token = req.query.tkn;
        let merchant_id = req.query.id;
        let response = await order.getAllOnlineOrderForSettelment(token, merchant_id);
        res.send({success:true, data:response, message:'orders list'});
    }catch(error){
        res.status(error.statusCode || 500).send(error.message);
    }

});

router.get('/refund_order', async(req,res) =>{
    try{
        let order = new Order_Admin();
        let order_id = req.query.order_id;
        let response = await order.refundPartialOrder(order_id);
        res.send({success:true, data:response, message:'orders list'});
    }catch(error){
        res.status(error.statusCode || 500).send(error.message);
    }

});

router.get('/delete_product_merchant_id_bulk', async(req,res) =>{
    try{
        let order = new Order_Admin();
        let merchant_frysto_id = req.query.id;
        let response = await order.BulkDeleteProductsAccordingToMerchant(merchant_frysto_id);
        res.send({success:true, data:response, message:'orders list'});
    }catch(error){
        res.status(error.statusCode || 500).send(error.message);
    }

});

module.exports = router;