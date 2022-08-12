const express = require('express');
const router = express.Router();
const {checkStock} = require("../controllers/productController.js");
const authMiddleWare = require("../middleware/auth.js");

//register all product routes
router.route("/:userid/checkStatus/:productid/:date").get(authMiddleWare,checkStock);

module.exports = router;