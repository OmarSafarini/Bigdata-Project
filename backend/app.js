const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require('./routes/user.routes');
const recipeRouter = require('./routes/recipes.routes');
const rateRouter = require('./routes/rate.routes');
const recommendedRouter = require('./routes/recommendedRecipe.routes');
require("dotenv").config()


const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;

mongoose.connect(DB_URL)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log("Error: " + err));

app.use('/api/users', userRouter);
app.use('/api/recipes', recipeRouter);
app.use('/api/ratings', rateRouter);
app.use('/api/recommended', recommendedRouter);

app.listen(PORT, () => {
  console.log("Server started on PORT 3000");
});
