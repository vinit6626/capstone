const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://trendifycapstone:TrendifyCapstone@cluster0.8lsreoq.mongodb.net/Trendify?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log('DB Connection Successfull'))
.catch((err) => {
    console.error(err);
});

const brandDataSchema = mongoose.Schema({
    brand_name:  {type: String, unique: true},
    brand_visibility: {type: String, default:'visible'},
    brand_addedBy: {type: String, default: 'default'},
    brand_updatedBy: {type: String, default: 'default'},
    brand_created_date: {type: String, default: 'default'},
    brand_updated_date: {type: String, default: 'default'}
})

const brandDataModel = mongoose.model("brand", brandDataSchema);

module.exports = brandDataModel;