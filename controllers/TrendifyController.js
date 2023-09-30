const userDataModel = require('../models/userdb.js');
const bcrypt = require('bcrypt');

class TrendifyController {
    static loginController = async (req, res) => {
        res.render('login.ejs', {msg: ""});
    }
    static registerUserController = async (req, res) => {
        try {
            const form_data = req.body;
            const hashPassword = await bcrypt.hash(form_data.password, 10);

            const userData_inserted = await userDataModel.create({
                email: form_data.email,
                password: hashPassword,
                userType: "user"
            });

            console.log("*** data added successfully to DB ***");
            console.log(userData_inserted);
            res.render("login.ejs", { msg: "Sign up Successful👍"});
        } catch (error) {
            console.log("--- Sorry data is not added to DB due to error Below -----");
            console.error(error);
            res.render("login.ejs", { msg: 'Please, sign up with a different email'});
        }
    }
    
    static userVerificationController = async (req, res) => {
        const { email, password } = req.body;
        const confirm_user_in_db = await userDataModel.findOne({ email: email })
        if (!confirm_user_in_db) {
            console.log("hello");
            res.render("login.ejs", { msg: "😢 User Not Found, Please Enter Valid Email" });
        } else {
            const isMatch = await bcrypt.compare(password, confirm_user_in_db.password);
            if (isMatch) {
                req.session.userEmail = confirm_user_in_db.email;
                email: confirm_user_in_db.email;
                console.log(req.session.userEmail)
                res.redirect("/home");

            } else {
                res.render("login.ejs", { msg: "Incorrect Password 😔, Please Enter Valid Password" });

            }
        }
    }
    static forgotpasswordController = async (req, res) => {
                res.render("forgotpassword.ejs", { msg: "" });
    }

    static updatepasswordController = async (req, res) => {
        console.log(req.body);
            try {
              const { email, password } = req.body;
              const user = await userDataModel.findOne({ email });
              if (!user) {
                return res.render("forgotpassword.ejs", { msg: "User not found, please enter your valid email address" });
              }
              const hashPassword = await bcrypt.hash(password, 10);
              await userDataModel.updateOne({ email }, { password: hashPassword });
              console.log("*** Password updated successfully ***");
              res.render("login.ejs", { msg: "Password updated successfully" });
            } catch (error) {
              console.error("Error updating password:", error);
              res.render("forgotpassword.ejs", { msg: "Password update failed" });
            }
    }

    static homeController = async (req, res) => {
        res.render('home.ejs');
    }

    static contactusController = async (req, res) => {
        res.render('contactus.ejs');
    }
    static aboutusController = async (req, res) => {
        res.render('aboutus.ejs');
    }
}

module.exports = TrendifyController