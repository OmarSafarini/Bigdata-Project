const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')

router.post('/', userController.addUser)

router.get('/:id', userController.getUserById)

router.put('/:id/ingredients', userController.addIngredient)

module.exports = router;
