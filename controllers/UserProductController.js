const productsDataModel = require('../models/productdb.js');
const brandDataModel = require('../models/branddb.js');
const categoryDataModel = require('../models/categorydb.js');

const nodemailer = require('nodemailer');


class UserProductControllers {

    static userProductController = async (req, res) => {

        const email = req.session.fname === "default" ? req.session.email : req.session.fname;

        // if (req.session.email && req.session.userType) {

            const productsData = await productsDataModel.find({product_visibility: 'visible'});
            const brandData = await brandDataModel.find({});
            const categoryData = await categoryDataModel.find({});
            res.render('userproduct/products.ejs', {msg: "", email, type: req.session.userType, productsData, brandData, categoryData});
            // }else{
            //     res.render("login.ejs", { msg: "Please login to access our service.", email, type: req.session.userType});
            // }
    }

  //   static viewProductController = async (req, res) => {
  //       req.session.product_id = req.params.id;
  //       res.redirect("/productdetails");
  //   }
    

  //   static productDetailsController = async (req, res) => {
  //     const email = req.session.fname === "default" ? req.session.email : req.session.fname;
  
  //     try {
  //         const product = await productsDataModel.findById(req.session.product_id);
  //         console.log("product: " + product);
  
  //         const brandData = await brandDataModel.find({});
  //         const categoryData = await categoryDataModel.find({ category_visibility: "visible" });
  //         const suggestionProductsData = await productsDataModel.find({ product_visibility: 'visible', product_brand_id: product.product_brand_id, product_gender: product.product_gender });
  
  //         console.log("suggestions : "+ suggestionProductsData);
  //         const productID = product ? product._id : null;
  //         const brandID = product ? product.product_brand_id : null;
  //         const categoryID = product ? product.product_category_id : null;
  
  //         const brandName = brandData.find(brand => brand._id.toString() === brandID);
  //         const bname = brandName ? brandName.brand_name : "Unknown Brand";
  //         const categoryName = categoryData.find(category => category._id.toString() === categoryID);
  //         const cname = categoryName ? categoryName.category_name : "Unknown Category";

  //         res.render("userproduct/viewproduct.ejs", { msg: "", email, type: req.session.userType, product, brandData, categoryData, suggestionProductsData, bname, cname  });
  //     } catch (error) {
  //         console.error(error);
  //     }
  // }
  

  static viewProductController = async (req, res) => {
    req.session.product_id = req.params.id;
    console.log("received id: " + req.params.id);

    const email = req.session.fname === "default" ? req.session.email : req.session.fname;

    try {
        // Use findOne instead of find if you expect a single result
        const product = await productsDataModel.findOne({ product_title: req.params.id });

        if (!product) {
            // Handle the case where the product is not found
            res.render("userproduct/viewproduct.ejs", { msg: "Product not found", email, type: req.session.userType });
            return;
        }

        const brandData = await brandDataModel.find({});
        const categoryData = await categoryDataModel.find({ category_visibility: "visible" });
        const suggestionProductsData = await productsDataModel.find({
            product_visibility: 'visible',
            product_brand_id: product.product_brand_id,
            
        });

        console.log("suggestions : " + suggestionProductsData);
        const productID = product ? product._id : null;
        const brandID = product ? product.product_brand_id : null;
        const categoryID = product ? product.product_category_id : null;

        const brandName = brandData.find(brand => brand._id.toString() === brandID);
        const bname = brandName ? brandName.brand_name : "Unknown Brand";
        const categoryName = categoryData.find(category => category._id.toString() === categoryID);
        const cname = categoryName ? categoryName.category_name : "Unknown Category";

        res.render("userproduct/viewproduct.ejs", { msg: "", email, type: req.session.userType, product, brandData, categoryData, suggestionProductsData, bname, cname, mail: req.session.email });
    } catch (error) {
        console.error(error);
        // Handle other errors, log them, or render an error page as needed
        res.render("error.ejs", { msg: "An error occurred", email, type: req.session.userType });
    }
}


    static searchProductController = async (req, res) => {
        const email = req.session.fname === "default" ? req.session.email : req.session.fname;
    
        console.log(req.body);
        function buildMongoQuery(queryObject) {
          const filters = [];
      
          if (queryObject.productName) {
            filters.push({ product_title: queryObject.productName });
          }
      
          if (queryObject.product_brand && queryObject.product_brand !== 'Select Brand') {
            filters.push({ product_brand_id: queryObject.product_brand });
          }
      
          if (queryObject.product_category && queryObject.product_category !== 'Select Category') {
            filters.push({ product_category_id: queryObject.product_category });
          }
      
          if (queryObject.gender) {
            filters.push({ product_gender: queryObject.gender });
          }
          if (filters.length > 0) {
            const query = { $and: filters };
            return query; 
        } else {
            return {};
        }
        }
      
        console.log("query");
        const mongoQueryObject = buildMongoQuery(req.body);
        console.log(mongoQueryObject);
        
        const sortOptions = {};
        if (req.body.priceSort === "lowToHigh") {
            sortOptions.product_price = 1; // Sort by product_price in ascending order
        } else if (req.body.priceSort === "highToLow") {
            sortOptions.product_price = -1; // Sort by product_price in descending order
        }
        
        const productsData = await productsDataModel.find(mongoQueryObject).sort(sortOptions); // Apply sorting
        console.log(productsData);
        console.log("product Fetched");
    
        const brandData = await brandDataModel.find({});
        const categoryData = await categoryDataModel.find({});
        res.render("userproduct/products.ejs", {msg:"", email, type: req.session.userType, productsData, brandData, categoryData});
      }



  
}
module.exports = UserProductControllers