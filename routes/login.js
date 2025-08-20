const express = require('express');
const router = express.Router();
const { loginRoute } = require('../middleware/auth');
const { userValidationSchema } = require('../middleware/joivalidation');
const validate = require('../middleware/validate');

// POST /api/login
router.post('/', validate(userValidationSchema), loginRoute);

module.exports = router;

