const {register} = require('../controllers/userController.js');
const express = require('express');

const router = express.Router();

//register all user routes
router.route('/register').post(register);

module.exports = router;