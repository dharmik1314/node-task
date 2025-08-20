const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { userValidationSchema } = require('../middleware/joivalidation');
const validate = require('../middleware/validate');
const { authenticateToken } = require('../middleware/auth');

// Create a new user
router.post('/', validate(userValidationSchema), userController.create);

// Create users in bulk
router.post('/bulk', userController.bulkCreate);

// Get all users
//router.get('/bulk', userController.bulkGet); // (if you have a bulk get route)
router.get('/', authenticateToken, userController.findAll);

// Get a user by ID
router.get('/:id', userController.findOne);

// Update a user by ID
router.put('/:id', validate(userValidationSchema), userController.update);

// Update users in bulk
router.put('/bulk',userController.bulkUpdate);

// Delete a user by ID
router.delete('/:id', userController.delete);

module.exports = router;