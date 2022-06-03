const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Order = require("../models/OrderModel");
const ErrorHandler = require("../utils/errorHandler");
const Product = require("../models/Prodmodel");

exports.newOrder  = catchAsyncErrors(async (req,res,next)=>{

    const {shippingInfo ,orderItems ,paymentInfo ,itemsPrice ,taxPrice ,shippingPrice ,totalPrice } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(201).json({
        success: true,
        order,
    })
});

// Get single ORder
exports.getSingleOrder = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id).populate("user","name email")

    if(!order){
        return next(new ErrorHandler("Order Not FOund with this id",404))
    }

    res.status(200).json({
        success:true,
        order,
    })
});


// Get Orders of logged in users
exports.myOrders = catchAsyncErrors(async(req,res,next)=>{
    const orders = await Order.find({user: req.user._id});

    res.status(200).json({
        success:true,
        orders,
    })
});

// Get All oRders -- ADMIN
exports.getAllOrders = catchAsyncErrors(async(req,res,next)=>{
    const orders= await Order.find();

    let totalAmount = 0;

    orders.forEach((order)=>{
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success:true,
        totalAmount,
        orders
    })
});

// Update Order Status -- ADMIN
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order not found with this Id", 404));
    }

    if(order.orderStatus === 'Delivered')
        return next(new ErrorHandler(`Product has been delivered`,400))

    if (req.body.status === "Shipped") {
        order.orderItems.forEach(async (o) => {
            await updateStock(o.product, o.quantity);
        });
    }
    order.orderStatus = req.body.status;
    
    if(req.body.status === 'Delivered')
        order.deiveredAt = Date.now();

    await order.save({validateBeforeSave: false});

    res.status(200).json({
        success: true,
    })
});

async function updateStock(id,quantity){
    const product = await Product.findById(id);

    product.Stock -= quantity;

    await product.save({validateBeforeSave: false}); 
}

exports.deleteOrder = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order Not FOund with this id", 404))
    }
    
    await order.remove();

    res.status(200).json({
        success:true,
    })
})