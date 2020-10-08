'use strict';
const express = require('express');
const router = express.Router();
const User = require('../../controllers/user/user_controller');
const ChangePasswordController = require('../../controllers/user/change_password_controller');
const log_collections = require('../../db/config').mongo_config.log_collections;

router.get('/', async (req, res) => {
    try {
        let user = new User();
        let response = await user.getUserData(req.body);
        res.send({ success: true, data: response, message: 'Success' });
    } catch (error) {
        res.status(error.statusCode || 500).send(error.message);
    }
});




router.post('/change-password', async (req, res) => {
    try {
        let changePassword = new ChangePasswordController();
        let response = await changePassword.changePasswordByUser(req.body);
        res.send({ success: response, data: null, message: 'Password updated successfully.' });

    } catch (error) {
        res.status(error.statusCode || 500).send({ success: false, message: error.message });
    }
});

router.patch('/update-details', async (req, res) => {
    try {
        let user = new User();
        let response = await user.updateUserDetails(req.body);
        res.send({ success: true, data: response, message: 'User Details updated successfully.' });

    } catch (error) {
        res.status(error.statusCode || 500).send({ success: false, message: error.message });
    }
});

// Set user profile pic
router.post("/set-profile-pic", async (req, res) => {
    try {
        let user = new User();
        let response = await user.updateProfilePic(req.body, req.files);
        res.send({ success : response, message: 'Profile pic uploaded successfully' });
    } catch (error) {
        res.status(error.statusCode || 500).send({ success: false, message: error.message });
    }
});

//Add address
router.post("/address", async (req, res) => {
    try {
        let user = new User();
        let response = await user.addAddress(req.body);
        res.send({ success : true, data: { address_id: response }, message: 'Address added successfully' });
    } catch (error) {
        res.status(error.statusCode || 500).send({ success: false, message: error.message });
    }
});

//Update address
router.put("/address", async (req, res) => {
    try {
        let user = new User();
        let response = await user.updateAddress(req.body);
        res.send({ success : true, data: response, message: 'Address updated successfully' });
    } catch (error) {
        res.status(error.statusCode || 500).send({ success: false, message: error.message });
    }
});

router.get("/address", async (req, res) => {
    try {
        let user = new User();
        let response = await user.getAddressByUserId(parseInt(req.body.user_id));

        res.send({ success : true, data: response, message: 'Address of user' });
    } catch (error) {
        res.status(error.statusCode || 500).send({ success: false, message: error.message });
    }
});
//check current password
router.post('/verify-current-password', async (req, res) => {
    try {
        let changePassword = new ChangePasswordController();
        let response = await changePassword.verifyCurrentPassword(req.body);
        res.status(200).send({ success: true, data: response, statusCode : 200,  message: 'Success' });
    } catch (error) {
        res.status(error.statusCode || 500).send({ success: false, message: error.message, statusCode: error.statusCode || 500});
    }
});

//Add category
router.post("/category", async (req, res) => {
    try {
        let user = new User();
        let response = await user.addCategory(req.body);
        res.send({ success : true, data: { category_id: response }, message: 'Category added successfully' });
    } catch (error) {
        res.status(error.statusCode || 500).send({ success: false, message: error.message });
    }
});

//Update category
router.patch("/category", async (req, res) => {
    try {
        let user = new User();
        let response = await user.updateCategory(req.body);
        res.send({ success : true, data: response, message: 'Category updated successfully' });
    } catch (error) {
        res.status(error.statusCode || 500).send({ success: false, message: error.message });
    }
});

//Category List
router.get("/category", async (req, res) => {
    try {
        let user = new User();
        let response = await user.getCategory();
        res.send({ success : true, data: response, message: 'List of categories' });
    } catch (error) {
        res.status(error.statusCode || 500).send({ success: false, message: error.message });
    }
});

//Delete category by id
router.delete("/category/:id", async (req, res) => {
    try {
        let user = new User();
        let response = await user.deleteCategory(parseInt(req.params.id));
        res.send({ success : response, message: 'Category deleted successfully' });
    } catch (error) {
        res.status(error.statusCode || 500).send({ success: false, message: error.message });
    }
});
module.exports = router;