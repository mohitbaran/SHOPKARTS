const mongoose = require('mongoose');

const ProdSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Enter Product Name"],
        trim: true, 
    },
    description:{
        type: String,
        required: [true, "Enter Product Description"],
    },
    price:{
        type: Number,
        required: [true, "Please Enter Product Price"],
        maxLength: [7, "Price cannot exceed 7 figures"],
    },
    ratings:{
        type: Number,
        default: 0,
    },
    images:[
        {
        public_id:{
            type: String,
            required: true,
        },
        url:{
            type:String,
            required: true,
        }
    }
    ], 
    category:{
        type: String,
        required: [true, "Enter the category"],
    },
    Stock: {
        type: Number,
        required: [true, "Enter the amount of Stock"],
        maxLength: [4],
        default: 1,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            }
        }
    ],

    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt:{
        type: Date,
        default:Date.now
    }
})

module.exports = mongoose.model("Product", ProdSchema);
