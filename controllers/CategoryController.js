const categoryDataModel = require('../models/categorydb.js');


class CategoryControllers {

   static categoryController = async (req, res) => {
        const email = req.session.fname === "default" ? req.session.email : req.session.fname;
            res.render('category/category.ejs', {msg: "", email, type: req.session.userType});
    }
    

    static addCategoryController = async (req, res) => {

        const email = req.session.fname === "default" ? req.session.email : req.session.fname;
        try {
            const findcategory = await categoryDataModel.find({category_name: req.body.categoryName});

            if(findcategory.length > 0) {
                res.render('category/category.ejs', { msg: 'Category already exists', email, type: req.session.userType });

            }else{
                const currentDate = new Date();
                const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

                const categoryData_inserted = await categoryDataModel.create({
                    category_name: req.body.categoryName,
                    category_visibility: req.body.categoryvisibility,
                    category_addedBy: req.session.email,
                    category_updatedBy: "default",
                    category_update_date: "default",
                    category_created_date: formattedDate
                });
            }
            res.redirect("/managecategory");
        } catch (error) {
            console.error(error);
            res.render('category/category.ejs', { msg: 'An error occurred', email, type: req.session.userType });
        }
    }

    static manageCategoryController = async (req, res) => {
        const email = req.session.fname === "default" ? req.session.email : req.session.fname;
          
        try{
            const category_data = await categoryDataModel.find({});
            res.render("category/managecategory.ejs", {msg:"", email, type: req.session.userType, category_data});
        }catch(err){
            console.error(err);
            res.redirect("/home");
        }
    }

}
module.exports = CategoryControllers