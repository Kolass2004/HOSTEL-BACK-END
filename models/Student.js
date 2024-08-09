const mongoose = require('mongoose');

// Define the Student schema
const StudentSchema = new mongoose.Schema({
    name: String,
    age: String,
    subject: String,
    dob: String,
    class: String,
    bloodGroup: String,
    religion: String,
    caste: String,
    dalitChristian: Boolean,
    fatherName: String,
    parentOccupation: String,
    parentAddress: String,
    parentMobileNo: String,
    studentMobileNo: String,
    pincode: String,
    previousSchool: String,
    residentLastYear: Boolean,
    previousHostelName: String,
    previousHostelPlace: String,
    image: String, // Base64 encoded image
});

// Create and export the model
module.exports = mongoose.model('Student', StudentSchema);
