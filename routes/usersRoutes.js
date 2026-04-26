const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const verifyJWT = require('../middleware/verifyJWT');
const verifyAdmin = require('../middleware/verifyAdmin');

router.use(verifyJWT);
router.use(verifyAdmin);

router.route('/').get(usersController.getAllUsers);
module.exports = router;