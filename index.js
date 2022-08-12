const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const limiter = require('./middleware/rateLimiter.js');

//import all routes
const userRouter = require('./routes/user.js');
const productRouter = require("./routes/products.js");
const orderRouter = require("./routes/orders.js");

//create app
const app = express();

//add middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api",limiter);
app.use("/api",userRouter);
app.use("/api",orderRouter);
app.use("/api",productRouter);

//default home route
app.get("/",(req,res)=>{
  res.status(200).send("<h1>Dairy Milk Distributor</h1>");
})

module.exports = app;