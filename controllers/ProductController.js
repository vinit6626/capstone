const productDataModel = require('../models/productdb.js');
const brandDataModel = require('../models/branddb.js');
const categoryDataModel = require('../models/categorydb.js');
const bodyParser = require('body-parser');


class ProductControllers {
    
    static productController = async (req, res) => {
        const email = req.session.fname === "default" ? req.session.email : req.session.fname;

    // Function to generate a random unique SKU
    const generateUniqueSKU = async () => {
        let isUnique = false;
        let sku;

        while (!isUnique) {
            sku = Math.floor(Math.random() * 100000).toString();
            const existingProduct = await productDataModel.findOne({ product_sku: sku });
            if (!existingProduct) {
                isUnique = true;
            }
        }
        return sku;
    };

    // Generate a unique SKU for the new product
    const uniqueSKU = await generateUniqueSKU();


    const brand = await brandDataModel.find({});
    const visibleBrandCount = await brandDataModel.countDocuments({ brand_visibility: 'visible' });


    

    const category = await categoryDataModel.find({});
    const visibleCategoryCount = await categoryDataModel.countDocuments({ category_visibility: 'visible' })


    res.render('product/product.ejs', { msg: "", email, type: req.session.userType, sku: uniqueSKU, brand, visibleBrandCount,  category, visibleCategoryCount });

    }
    

    static addProductController = async (req, res) => {
        const email = req.session.fname === "default" ? req.session.email : req.session.fname;
        try {
            const currentDate = new Date();
            const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
            const concatenatedSizes = req.body.product_size.join(', '); 
            console.log(concatenatedSizes);

            const productData_inserted = await productDataModel.create({
                product_title: req.body.productName,
                product_description : req.body.productDescription,
                product_sku : req.body.product_sku,
                product_quantity : req.body.productQuantity,
                product_image_path : req.file.filename,
                product_size : concatenatedSizes,
                product_category_id : req.body.product_category,
                product_brand_id : req.body.product_brand,
                product_gender : req.body.gender,
                product_price : req.body.productPrice,
                product_visibility : req.body.productvisibility,
                product_addedBy : req.session.email,
                product_updatedBy : "default",
                product_created_date : formattedDate,
                product_updated_date : "default",
            });
            res.redirect("/managecategory");
        } catch (error) {
            console.error(error);
            res.render('category/category.ejs', { msg: 'An error occurred', email, type: req.session.userType });
        }
    }

    static manageProductController = async (req, res) => {
        const email = req.session.fname === "default" ? req.session.email : req.session.fname;
        if (req.session.email && req.session.userType) {
          
            try{
                const category_data = await categoryDataModel.find({});
                res.render("category/managecategory.ejs", {msg:"", email, type: req.session.userType, category_data});
            }catch(err){
                console.error(err);
                res.redirect("/home");
            }
        }else{
        res.render("login.ejs", { msg: "Please login to access our service.", email, type: req.session.userType});
        }
    }

    static deleteProductController = async (req, res) => {
        try {
            const categoryId = req.params.id;
            const categoryDeleteFromDB = await categoryDataModel.findByIdAndDelete(categoryId);
            res.redirect("/managecategory");
        } catch (error) {
            console.log(error);
            // Handle the error as needed
            res.redirect("/managecategory");
        }
    }

    static editProductController = async (req, res) => {
        try {
            const categoryId = req.params.id;
            const categorydata = await categoryDataModel.findById(categoryId);

            const email = req.session.fname === "default" ? req.session.email : req.session.fname;
            res.render("category/editcategory.ejs", { msg:"", email, type: req.session.userType, categorydata})
            // res.redirect("/managecategory");
        } catch (error) {
            console.log(error);
            res.redirect("/managecategory");
        }
    }

    static updateProductController = async (req, res) => {
        const email = req.session.fname === "default" ? req.session.email : req.session.fname;
    
        console.log(req.body);
        try {
            const currentDate = new Date();
            const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

        const updateCategory = await categoryDataModel.findByIdAndUpdate(
            req.body.category_id, 
            {
                category_name: req.body.categoryName,
                category_visibility: req.body.categoryvisibility,
                category_updated_date: formattedDate, 
                category_updatedBy: req.session.email,
            }
        );
            res.redirect("/managecategory");
        } catch (error) {
            console.log(error);
            res.redirect("/managecategory");
        }
    }

}
module.exports = ProductControllers