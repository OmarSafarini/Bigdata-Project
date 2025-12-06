const userService = require('../services/user.service')

class UserController{
    async addUser(req, res){
        try{
            const newUser = await userService.createUser(req.body)
            res.status(201).json(newUser);
        }catch (err){
            res.status(400).json({ error: err.message });
        }
    }

    async getUserById(req, res){

        try{
            const user = await userService.getUserById(req.params.id);
            if(!user){
                return res.status(404).json({message: "User not found"})
            }
            res.json(user)

        }catch(error){
            res.status(500).json({ error: error.message });
        }
       
    }

    async addIngredient(req, res){
        try{
            const updatedUser = userService.addIngredient(req.params.id, req.body)
            res.json(updatedUser)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = new UserController()