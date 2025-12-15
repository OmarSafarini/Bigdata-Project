const User = require('../models/User')
const KafkaHelper = require('../kafka/kafkaHelper')
class UserService{

    constructor() {
        this.kafkaHelper = new KafkaHelper();
        this.initialized = false;
    }

    async initialize() {
        if (!this.initialized) {
            await this.kafkaHelper.connect();
            this.initialized = true;
            console.log('UserService initialized');
        }
    }

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

        await this.initialize();

        await this.kafkaHelper.sendEvent(id, ingredient, 'ADD');

        return updatedUser
    }

    async deleteIngredient(id, ingredient){
         const updatedUser = await User.findByIdAndUpdate(id,
           { $pull: { ingredients: ingredient } },
           { new: true }
        )

        await this.initialize();
        await this.kafkaHelper.sendEvent(id, ingredient, 'REMOVE');

        return updatedUser
    }

}


module.exports = new UserService();
