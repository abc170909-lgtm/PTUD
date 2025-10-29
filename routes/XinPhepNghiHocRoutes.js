const express = require('express');
const router = express.Router();
const XinPhepNghiHocController = require('../controllers/XinPhepNghiHocController');

router.get('/render', XinPhepNghiHocController.renderForm);
router.post('/submit', XinPhepNghiHocController.submitRequest);
router.get('/history', XinPhepNghiHocController.getHistory);

module.exports = router;
