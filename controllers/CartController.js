const cartDataModel = require('../models/cartdb.js');
const productDataModel = require('../models/productdb.js');


class cartControllers {

    static addToCartController = async (req, res) => {

    console.log(req.query);
    const cartData_update = await cartDataModel.find({ product_id: req.query.product_id, size: req.query.selectedSize, user_id: req.query.user_email });
    console.log("cart length: ", cartData_update.length);
    console.log("Query:", { product_id: req.query.product_id, size: req.query.selectedSize });
    console.log("Result:", cartData_update);
    
    if (cartData_update.length > 0) {
      console.log("length more than 0");
      const cartData_update = await cartDataModel.findOneAndUpdate(
        {
          product_id: req.query.product_id,
          size: req.query.selectedSize,
          user_id: req.query.user_email,
        },
        {
          $inc: { quantity: req.query.quantity },
        },
        { new: true } // Return the updated document
      );

    } else {
      console.log("not found");
      const cartData_inserted = await cartDataModel.create({
            user_id: req.query.user_email,
            product_id: req.query.product_id,
            size : req.query.selectedSize,
            quantity : req.query.quantity,
        });
    }
    res.redirect("/viewcart");

  }
  static viewCartController = async (req, res) => {
    const email = req.session.fname === "default" ? req.session.email : req.session.fname;
    const mail = req.session.email;
    
    const cartItems = await cartDataModel.find({user_id: mail});
    console.log(cartItems.length);
    req.session.cartItem = cartItems.length;
    const productItems = await productDataModel.find();

    res.render("cart/cart.ejs", {msg: "", email, type: req.session.userType, cartItems, productItems, cart: req.session.cartItem});
  }

  static deleteCartProductController = async (req, res) => {
    const id = req.params.id;
    try {
      const cartProductDeleteFromDB = await cartDataModel.findByIdAndDelete(id);
      res.redirect("/viewcart");
    } catch (error) {
        console.log(error);
        res.redirect("/viewcart");
    }
  }
}

module.exports = cartControllers
