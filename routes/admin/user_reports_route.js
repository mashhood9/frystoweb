"use strict";
const express = require("express");
const router = express.Router();
const AdminUserController = require("../../controllers/admin");
const log_collections = require('../../db/config').mongo_config.log_collections;

router.get("/", async (req, res) => {
  try {
    let adminController = new AdminUserController(req.query, req.body);
    let result = await adminController.getUsersReport();
    res.send({ success: true, data: result });
  } catch (error) {
    res.status(error.statusCode || 500).send({ success: false, message: error.message, data: null });
  }
});

module.exports = router;
