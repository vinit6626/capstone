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
            sku = Math.floor(Math.random() * 10).toString();
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
            let joinedSizes;
            if (Array.isArray(req.body.product_size)) {
                joinedSizes = req.body.product_size.join(', ');
            } 
            console.log(joinedSizes);
            console.log(req.body.product_gender);
            console.log(req.body);

            const productData_inserted = await productDataModel.create({
                product_title: req.body.productName,
                product_description : req.body.productDescription,
                product_sku : req.body.product_sku,
                product_quantity : req.body.productQuantity,
                product_image_path : req.file.filename,
                product_size : joinedSizes,
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
            res.redirect("/manageproduct");
        } catch (error) {
            console.error(error);
            res.redirect('/product');
        }
    }

    static manageProductController = async (req, res) => {
        const email = req.session.fname === "default" ? req.session.email : req.session.fname;
          
            try{
                const product_data = await productDataModel.find({});
                const brand_data = await brandDataModel.find({});
                const category_data = await categoryDataModel.find({});
                console.log(product_data);
                console.log(brand_data);

                res.render("product/manageproduct.ejs", {msg:"", email, type: req.session.userType, product_data, brand_data, category_data});
            }catch(err){
                console.error(err);
                res.redirect("/home");
            }
    }

    static deleteProductController = async (req, res) => {
       
    }

    static editProductController = async (req, res) => {
        
    }

    static updateProductController = async (req, res) => {
       
    }

}
module.exports = ProductControllers