'use strict';
var express = require('express');
var router = express.Router();
let Order_Admin=require('../../controllers/order_admin/order_controller');

router.get('/orders', async(req,res) =>{
    try{
        let order = new Order_Admin();
        let response = await order.getAllOrder();
    }catch(error){
        res.status(error.statusCode || 500).send(error.message);
    }

});