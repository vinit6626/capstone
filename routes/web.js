
const express = require('express');

const router = express.Router();

const TrendifyControllers = require('../controllers/TrendifyController.js');

router.get('/home', TrendifyControllers.dashboardController);

module.exports = router
