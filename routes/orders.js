const express = require('express');
const router = express.Router();
const { addOrder,updateOrder,updateOrderStatus,deleteOrder,getOrders } = require('../controllers/orderController.js');
const authMiddleWare = require('../middleware/auth.js');

//register all the routes related to books
router.route("/:userid/addOrder").post(authMiddleWare,addOrder);
router.route("/:userid/updateOrder/:orderid").put(authMiddleWare,updateOrder);
router.route("/:userid/deleteOrder/:orderid").delete(authMiddleWare,deleteOrder);
router.route("/:userid/updateOrderStatus/:orderid").patch(authMiddleWare,updateOrderStatus);
router.route("/:userid/all_Orders").get(authMiddleWare,getOrders);

module.exports = router;