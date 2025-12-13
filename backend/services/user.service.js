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
            {$push : {ingredients: ingredient}},
            { new: true }
        )

        return updatedUser
    }

    async deleteIngredient(id, ingredient){
         const updatedUser = await User.findByIdAndUpdate(id,
           { $pull: { ingredients: ingredient } },
           { new: true }
        )

        return updatedUser
    }

}


module.exports = new UserService();
