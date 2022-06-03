const express = require("express");
const app = express();
const cookieparser = require("cookie-parser");
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const errorMiddleWare = require('./middleware/error')

app.use(express.json())
app.use(cookieparser());
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload());

//route
const product=require("./routes/ProductRoute");
const user=require("./routes/UserRoute");
const order = require("./routes/orderRoute");

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1",order);

//MiddleWare for errors
app.use(errorMiddleWare);

module.exports=app;