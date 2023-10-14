const productDataModel = require('../models/productdb.js');
const brandDataModel = require('../models/branddb.js');
const categoryDataModel = require('../models/categorydb.js');
const bodyParser = require('body-parser');


class ProductControllers {
    
    static productController = async (req, res) => {
        const email = req.session.fname === "default" ? req.session.email : req.session.fname;

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


            try {
                const updatedCategory = await categoryDataModel.findByIdAndUpdate(
                  req.body.product_category,
                  { $inc: { productCount: 1 } },
                  { new: true } // To get the updated document
                );
                    
                if (!updatedCategory) {
                  console.error('Category not found or not updated.');
                } else {
                  console.log('Category updated successfully:', updatedCategory);
                }
                const updatedBrand = await brandDataModel.findByIdAndUpdate(
                    req.body.product_brand,
                    { $inc: { productCount: 1 } },
                    { new: true } // To get the updated document
                  );
                      
                  if (!updatedBrand) {
                    console.error('Brand not found or not updated.');
                  } else {
                    console.log('Brand updated successfully:', updatedBrand);
                  }

              } catch (err) {
                console.error('Error updating category:', err);
              }
              
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
                res.render("product/manageproduct.ejs", {msg:"", email, type: req.session.userType, product_data, brand_data, category_data});
            }catch(err){
                res.redirect("/home");
            }
    }

    static deleteProductController = async (req, res) => {
        try {
            const productId = req.params.id;
            const product_data = await productDataModel.findById(productId);
             console.log(product_data);
             console.log(product_data.product_category_id);
            const categoryID = product_data.product_category_id;
            const brandID = product_data.product_brand_id;
            console.log(categoryID);
            try {
                const updatedCategory = await categoryDataModel.findByIdAndUpdate(
                    categoryID,
                    { $inc: { productCount: -1 } }, // Decrement by 1
                    { new: true } // To get the updated document
                  );
              
                if (!updatedCategory) {
                  console.error('Category not found or not updated.');
                } else {
                  console.log('Category updated successfully:', updatedCategory);
                }

                const updatedBrand = await brandDataModel.findByIdAndUpdate(
                    brandID,
                    { $inc: { productCount: -1 } }, // Decrement by 1
                    { new: true } // To get the updated document
                  );
              
                if (!updatedBrand) {
                  console.error('Category not found or not updated.');
                } else {
                  console.log('Category updated successfully:', updatedBrand);
                }
              } catch (err) {
                console.error('Error updating category:', err);
              }

            const productDeleteFromDB = await productDataModel.findByIdAndDelete(productId);
            if (!productDeleteFromDB) {
                console.log(`Brand with ID ${productId} not found.`);
            } else {
                console.log(productDeleteFromDB);
            }
    
            res.redirect("/manageproduct");
        } catch (error) {
            console.log(error);
            res.redirect("/manageproduct");
        }
    }

    static editProductController = async (req, res) => {
        
    }

    static updateProductController = async (req, res) => {
       
    }

}
module.exports = ProductControllers