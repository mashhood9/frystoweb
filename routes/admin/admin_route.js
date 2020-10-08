"use strict";
const express = require("express");
const router = express.Router();
const userReportsRouter = require('./user_reports_route');
const adminUserActionsRouter = require('./admin_user_actions_route');

router.use('/user-report', userReportsRouter);
router.use('/user', adminUserActionsRouter);


module.exports = router;
