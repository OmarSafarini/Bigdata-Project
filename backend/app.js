const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require('./routes/user.routes');
const recipeRouter = require('./routes/recipes.routes');
const rateRouter = require('./routes/rate.routes');
const recommendedRouter = require('./routes/recommendedRecipe.routes');


const app = express();

app.use(cors("*"));
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/recipes")
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log("Error: " + err));

app.use('/api/users', userRouter);
app.use('/api/recipes', recipeRouter);
app.use('/api/ratings', rateRouter);
app.use('/api/recommended', recommendedRouter);

app.listen(3000, () => {
  console.log("Server started on PORT 3000");
});



// async function run(){
//   const theUsers = require('./models/User')

//   const cursor = theUsers.find().cursor();

//   for(let doc = await cursor.next(); doc != null; doc = await cursor.next()){
//     console.log(doc.ingredients)
//   }

// }
 
// run()

