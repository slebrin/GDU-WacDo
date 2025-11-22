const express = require('express');
const { getUsers, registerUser, loginUser, deleteUser } = require('../controllers/users.controller');
const { validateRegister, validateLogin, handleValidationErrors } = require('../middleware/validators');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, authorize('admin'), getUsers);
router.post('/register', auth, authorize('admin'), validateRegister, handleValidationErrors, registerUser);
router.post('/login', validateLogin, handleValidationErrors, loginUser);
router.delete('/:id', auth, authorize('admin'), deleteUser);

module.exports = router;