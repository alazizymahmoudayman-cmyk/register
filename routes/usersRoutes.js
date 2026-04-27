const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const verifyJWT = require('../middleware/verifyJWT');
const verifyAdmin = require('../middleware/verifyAdmain');

router.use(verifyJWT);

router.route('/').get(verifyAdmin, usersController.getAllUsers);
module.exports = router;