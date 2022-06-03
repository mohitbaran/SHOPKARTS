const app = require('./app');

const dotenv = require('dotenv');
const connectDB= require('./config/database');
const { Server } = require('http');
const cloudinary = require('cloudinary');

// Handling Uncaught Exception
// Jo chiz define nhi h uske liye like console.log(youtube);

process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting Down the Server due to the UnCaught Exception`);

    process.exit(1);

})

//config
dotenv.config({path:'backend/config/config.env'})

//connecting to db
connectDB();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const server= app.listen(process.env.PORT, ()=>{
    console.log(`server working on http://localhost:${process.env.PORT}`)
});


// Unhandled Promise Rejection
// Connecting error k liye catch statement h yeh..... jo humlog chore h database.js
process.on("unhandledRejection", (err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting Down the Server due to the Unhandled Promise Rejection`);

    server.close(()=>{
        process.exit(1);
    })
})