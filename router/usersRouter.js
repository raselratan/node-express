const express = require('express');
const {getUsers, addUser, deleteUser} = require('../controller/usersController');
const decorateHtmlResponse = require('../middlewares/common/decorateHtmlResponse')
const avaterUpload = require('../middlewares/users/avaterUpload');
const { addUserValidator, addUserValidationHandler } = require('../middlewares/users/usersValidator')

const router = express.Router();

// login page

router.get('/',decorateHtmlResponse('Users'), getUsers);
router.post('/', avaterUpload, addUserValidator, addUserValidationHandler, addUser);
router.delete('/:id', deleteUser);

module.exports = router;