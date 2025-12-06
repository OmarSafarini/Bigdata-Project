const User = require('../models/User')

class UserService{

    async createUser(data){
        const newUser = new User(data)
        return await newUser.save()
    }

    async getUserById(id){
        return await User.findById(id);
    }

    async addIngredient(id , ingredient){
        const updatedUser = await User.findByIdAndUpdate(id,
            {$push : {ingredients: ingredient}}
        )

        return updatedUser
    }

}


module.exports = new UserService();
