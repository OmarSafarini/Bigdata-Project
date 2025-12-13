const express = require("express");

const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/recipes")
.then(()=>{console.log("DB Connected")})
.catch((error)=>{console.log("Error: " + error)})



const userRouter = require('./routes/user.routes')

app.use('/api/users', userRouter);


// async function run(){
//   const theUsers = require('./models/User')

//   const cursor = theUsers.find().cursor();

//   for(let doc = await cursor.next(); doc != null; doc = await cursor.next()){
//     console.log(doc.ingredients)
//   }

// }
 
// run()


app.listen(3000, () => {
  console.log("Server started on PORT 3000");
});
