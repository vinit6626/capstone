//  Vinit Mohanbhai Dabhi - 8804874

// mongoose import
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
// database connection
mongoose.connect("mongodb+srv://vinit:vinit123@cluster0.orohzmx.mongodb.net/DriveTest?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log('DB Connection Successfull'))
.catch((err) => {
    console.error(err);
});


// create table/schema
const userDataSchema = mongoose.Schema({
    fName: {type: String, default: 'default'},
    lName:  {type: String, default: 'default'}, 
    email:  {type: String, default: 'demo', unique:true},
    password: {type: String, default: 'demo'},
    userType: {type: String, default: 'user'},
    dob:  {type: String, default: '0'},
    date_of_create: {type: String, default: Date.now },
})

// wrraped schema in model
const userDataModel = mongoose.model("userData", userDataSchema);


module.exports = userDataModel;

