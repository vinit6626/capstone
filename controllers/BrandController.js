const brandDataModel = require('../models/branddb.js');


class BrandControllers {
    static brandController = async (req, res) => {
        const email = req.session.fname === "default" ? req.session.email : req.session.fname;
        res.render('brand.ejs', {msg: "", email, type: req.session.userType});
    }

    static addBrandController = async (req, res) => {
        const email = req.session.fname === "default" ? req.session.email : req.session.fname;
        try {
            const findbrand = await brandDataModel.find({brand_name: req.body.brandName});

            if(findbrand.length > 0) {
                res.render('brand.ejs', { msg: 'Brand already exists', email, type: req.session.userType });

            }else{
                const currentDate = new Date();
                const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

                const brandData_inserted = await brandDataModel.create({
                    brand_name: req.body.brandName,
                    brand_visibility: req.body.brandvisibility,
                    brand_addedBy: req.session.email,
                    brand_updatedBy: "default",
                    brand_update_date: "default",
                    brand_created_date: formattedDate
                });
            }
            res.redirect("/managebrand");
        } catch (error) {
            console.error(error);
            res.render('brand.ejs', { msg: 'An error occurred', email, type: req.session.userType });
        }
    }
    static manageBrandController = async (req, res) => {
        const email = req.session.fname === "default" ? req.session.email : req.session.fname;

        try{
            const brand_data = await brandDataModel.find({});
            res.render("managebrand.ejs", {msg:"", email, type: req.session.userType, brand_data});
        }catch(err){
            console.error(err);
            res.redirect("/home");
        }
    }
    

}

module.exports = BrandControllers