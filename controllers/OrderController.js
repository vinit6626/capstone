const orderDataModel = require('../models/orderdb.js');
const cartDataModel = require('../models/cartdb.js');
const nodemailer = require('nodemailer');
const productDataModel = require('../models/productdb.js');


class OrderContoller {
    static orderCheckoutController = async (req, res) => {
        console.log(req.body);

        const cart_clear = await cartDataModel.deleteMany({ user_id: req.session.email });


        const orderData_inserted = await orderDataModel.create({
            product_title: JSON.stringify(req.body.product_title),
            product_price : JSON.stringify(req.body.price),
            product_size : JSON.stringify(req.body.size),
            product_quantity : JSON.stringify(req.body.quantity),
            product_grand_total : req.body.total,
            user_id : req.session.email,
            user_name : req.body.fullName,
            user_address : req.body.address,
            user_zipcode : req.body.zipCode,
            user_province : req.body.province,
            user_phone : req.body.phoneNumber,
            card_number : req.body.cardNumber,
            card_holder : req.body.cardHolderName,
            card_expiry : req.body.expiryDate,
            card_cvv : req.body.cvv,
        });
        if(orderDataModel){
            res.redirect("/home");
        }else{
            res.redirect("/contactus");
        }

    }

    static orderHistoryController = async (req, res) => {
    const email = req.session.fname === "default" ? req.session.email : req.session.fname;

        const history = await orderDataModel.find({user_id: req.session.email});
        const productItems = await productDataModel.find();

        console.log(history);
        res.render("order_history/orderhistory.ejs", {msg: "", email, type: req.session.userType, history, cart: req.session.cartItem, productItems});
    }
}

module.exports = OrderContoller
