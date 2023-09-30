const userDataModel = require('../models/userdb.js');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
function generateRandomCode() {
    return Math.floor(100000 + Math.random() * 900000);
}
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
                const type = confirm_user_in_db.userType;
                req.session.email = email;
                req.session.userType = type;
                console.log(req.session.userEmail);
                res.redirect("/home");
                // res.render("home.ejs", {email, type});

            } else {
                res.render("login.ejs", { msg: "Incorrect Password 😔, Please Enter Valid Password" });

            }
        }
    }

    static logoutController = (req, res) => {
        req.session.destroy(console.log("session destroyed"));
        res.redirect("/login");
    }

    static forgotpasswordController = async (req, res) => {
        res.render("forgotpassword.ejs", { msg: "" });
    }
    static passwordresetController = async (req, res) => {
        res.render("passwordreset.ejs", {msg: ""});
    }

    
    static sendemailController = async (req, res) => {
        console.log(req.body);
        const { email } = req.body;
        const confirm_user_in_db = await userDataModel.findOne({ email: email });
    
        if (!confirm_user_in_db) {
            console.log("hello");
            res.render("passwordreset.ejs", { msg: "😢 User Not Found, Please Enter Valid Email" });
        } else {
            // Generate a 6-digit random code
            const randomCode = generateRandomCode();
    
            // Update the user's record with the random code
            await userDataModel.updateOne({ email: email }, { verificationCode: randomCode });
    
            // Create a transporter for sending emails
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'trendify.capstone@gmail.com',
                    pass: 'totwqowcfcutwbik' // Use your Gmail application-specific password
                }
            });
    
            // Create an email with the random code
            const mailOptions = {
                from: 'trendify.capstone@gmail.com',
                to: email,
                subject: "Password Reset Verification Code",
                text: `Hello user,\n\nI hope you are doing great.\n\nYour verification code is: ${randomCode}\n\n Click on this given link to reset your password: http://localhost:2700/forgotpassword.\n\nIf you encounter any issues while updating your password, please feel free to contact our team at trendify.capstone@gmail.com.\n\nThank you!.`
            };
    
            // Send the email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    res.status(500).send("Error sending email.");
                } else {
                    res.redirect('/login'); // Redirect to the login page after sending the email
                }
            });
        }
    };
 
    static updatepasswordController = async (req, res) => {
        console.log(req.body);
        try {
            const { email, verificationCode, password, c_password } = req.body;
            const user = await userDataModel.findOne({ email });
    
            if (!user) {
                return res.render("forgotpassword.ejs", { msg: "User not found, please enter your valid email address" });
            }
    
            if (user.verificationCode !== verificationCode) {
                return res.render("forgotpassword.ejs", { msg: "Invalid verification code" });
            }
    
            const hashPassword = await bcrypt.hash(password, 10);
    
            await userDataModel.updateOne({ email }, { password: hashPassword, verificationCode: 'default' });
    
            console.log("*** Password updated successfully ***");
            res.render("login.ejs", { msg: "Password updated successfully" });
        } catch (error) {
            console.error("Error updating password:", error);
            res.render("forgotpassword.ejs", { msg: "Password update failed" });
        }
    }
    
    static homeController = async (req, res) => {
        if(req.session.email && req.session.userType){
            const email = req.session.email;
            const type = req.session.userType;
            res.render('home.ejs', {email, type});
        }else{
            res.redirect("/login");
        }
    }

    static contactusController = async (req, res) => {
        res.render('contactus.ejs');
    }
    static aboutusController = async (req, res) => {
        res.render('aboutus.ejs');
    }
}

module.exports = TrendifyController