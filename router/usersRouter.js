const express = require('express');
const {getUsers} = require('../controller/usersController');
const decorateHtmlResponse = require('../middlewares/common/decorateHtmlResponse')

const router = express.Router();

// login page

router.get('/',decorateHtmlResponse('Users'), getUsers);

module.exports = router;