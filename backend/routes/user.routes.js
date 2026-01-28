const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')

router.post('/', userController.addUser)

router.post('/login', userController.login);

router.get('/:id', userController.getUserById)

router.put('/:id/ingredients', userController.addIngredient)

router.put('/:id/ingredients/remove', userController.deleteIngredient)

module.exports = router;
