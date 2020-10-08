"use strict";
const express = require("express");
const router = express.Router();
const AdminUserPasswordController = require('../../controllers/admin/user_password');
const validator = require('../../models/admin/user_report_schema');
const BaseModel = require('../../utilities/base_model');
const masterListValidator = require('../../models/master_list_schema');
const productListValidator = require('../../models/product_list');
const AdminController = require('../../controllers/admin/index');


router.post("/:id/change-password", async (req, res) => {
  try {
    let adminController = new AdminUserPasswordController();
    let joi_schema_validator = new BaseModel();
    let change_pwd_obj = {
      id: req.params.id, 
      new_password: req.body.new_password
    };
    let user_obj = joi_schema_validator.validateModelSchema(change_pwd_obj, validator.admin_change_password());
    let result = await adminController.changePasswordByAdmin(user_obj);
    res.send({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    throw error;
    res.status(error.statusCode || 500).send({ success: false, message: error.message, data: null });
  }
});

router.post("/:id/reset-password", async (req, res) => {
  try {
    let adminController = new AdminUserPasswordController(req.body);
    let joi_schema_validator = new BaseModel();
    let user_id = joi_schema_validator.validateModelSchema(req.params.id, validator.admin_send_mail());
    let result = await adminController.resetPasswordByAdmin(user_id);
    res.send({ success: true, message: result.message });
  } catch (error) {
    res.status(error.statusCode || 500).send({ success: false, message: error.message });
  }
});

// router.post("/:id/resend-verification-email", async (req, res) => {
//   try {
//     let adminController = new AdminUserEmailController();
//     let joi_schema_validator = new BaseModel();
//     let user_id = joi_schema_validator.validateModelSchema(req.params.id, validator.admin_send_mail());
//     let result = await adminController.resendVerificationEmailByAdmin(user_id);
//     res.send({ success: true, message: result.message });
//   } catch (error) {
//     res.status(error.statusCode || 500).send({ success: false, message: error.message });
//   }
// });

router.post("/master-list", async (req, res) => {
  try {
    let adminController = new AdminController();
    let joi_schema_validator = new BaseModel();
    let data = joi_schema_validator.validateModelSchema(req.body, masterListValidator.masterListAddSchema());
    let result = await adminController.addMasterList(data);
    res.send({ success: true, data: { master_id: result }, message: "Master data added successfully" });
  } catch (error) {
    res.status(error.statusCode || 500).send({ success: false, message: error.message });
  }
});
router.post("/product-list", async (req, res) => {
  try {
    let adminController = new AdminController();
    let joi_schema_validator = new BaseModel();
    let data = joi_schema_validator.validateModelSchema(req.body, productListValidator.ProductListAddSchema());
    let result = await adminController.addProductList(data);
    res.send({ success: true,  product_id: result , message: "Master data added successfully" });
  } catch (error) {
    res.status(error.statusCode || 500).send({ success: false,  tree:true, message: error.message });
  }
});

//Master List based on the category id.
router.get("/master-list", async (req, res) => {
  try {
      let adminController = new AdminController();
      let category_id = req.query.category_id || 0;
      let response = await adminController.getMasterList(category_id);
      res.send({ success : true, data: response, message: 'Master list successfully' });
  } catch (error) {
      res.status(error.statusCode || 500).send({ success: false, message: error.message });
  }
});


//Delete master list by master id
router.delete("/master-list/:id", async (req, res) => {
  try {
      let adminController = new AdminController();
      let response = await adminController.deleteMasterList(parseInt(req.params.id));
      res.send({ success : response, message: 'Master list deleted successfully' });
  } catch (error) {
      res.status(error.statusCode || 500).send({ success: false, message: error.message });
  }
});

module.exports = router;
