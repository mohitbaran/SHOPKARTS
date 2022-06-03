const Product = require("../models/Prodmodel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");


//Create Product
exports.createProduct = catchAsyncErrors(async (req,res,next) =>{

    req.body.user = req.user.id;
    
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product,
    });
});

//Get all products
exports.getAllProducts = catchAsyncErrors(async(req,res)=>{

    resultPerPage = 8;
    const productCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(),req.query).search().filter();

    let products = await apiFeature.query;

    let filteredProductsCount = products.length;
    apiFeature.pagination(resultPerPage)

    products = await apiFeature.query;

    res.status(200).json({
        success: true,
        products,
        productCount,
        resultPerPage,
        filteredProductsCount,
    })
});

//Get Single Product

exports.getSingleProduct = catchAsyncErrors(async(req,res,next) =>{
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
        }
    

    res.status(200).json({
        success: true,
       product
    })
});


//Update Product

exports.updateProduct = catchAsyncErrors(async (req,res,next)=>{
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    product= await Product.findByIdAndUpdate(req.params.id, req.body, {
        new:true,
        runValidators: true, 
        useFindAndModify: false
    });

    res.status(200).json({
        success:true,
        product
    })
});

//Delete Product by id

exports.deleteProduct = catchAsyncErrors(async(req,res,next) =>{

    const product = await Product.findById(req.params.id);
    
    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    await product.remove();

    res.status(200).json({
        success:true,
        message:"Product Deleted Successfully", 
    })
});

// Create New Review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find((rev)=> rev.user.toString() === req.user._id.toString());

    if(isReviewed){
        product.reviews.forEach((rev) =>{
            if(rev.user.toString() === req.user._id.toString())
            (rev.rating=rating) , (rev.comment=comment);
        });
    }
    else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }
    let avg=0;
    product.reviews.forEach((rev) => {
        avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });
});

// Get all Reivews of a Product
exports.getProductReviews = catchAsyncErrors(async(req,res,next)=>{
    const prod=await Product.findById(req.query.id);

    if(!prod)
        return next(new ErrorHandler("Product Not FOund", 404));

    res.status(200).json({
        success:true,
        reviews: prod.reviews,
    })
})

// delete review
exports.deleteProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.prodId);

    if (!product)
        return next(new ErrorHandler("Product Not FOund", 404));

    const reviews = product.reviews.filter( rev=> rev._id.toString() !== req.query.id.toString()) 

    let avg = 0;
    reviews.forEach((rev) => {
        avg += rev.rating;
    });

    const ratings = avg / reviews.length;

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.prodId,{
        reviews,ratings,numOfReviews
    },{
        new:true,
        runValidators: true,
        useFindAndModify: false,
    }); 

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    })
})