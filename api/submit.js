const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const dotenv = require('dotenv');
const cors = require('cors'); // Importing CORS
const Student = require('../models/Student');

dotenv.config();

const app = express();
app.use(cors()); // Enabling CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Root route to respond with "Hi there!"
app.get('/', (req, res) => {
    res.send('Hi there!');
});

// Endpoint to handle form submission
app.post('/api/submit', upload.single('image'), async (req, res) => {
    const {
        name, age, subject, dob, class: studentClass, bloodGroup, religion, caste,
        dalitChristian, fatherName, parentOccupation, parentAddress, parentMobileNo,
        studentMobileNo, pincode, previousSchool, residentLastYear, previousHostelName,
        previousHostelPlace
    } = req.body;

    // Create a new student entry
    const student = new Student({
        name, age, subject, dob, class: studentClass, bloodGroup, religion, caste,
        dalitChristian: dalitChristian === 'on', // Checkbox handling
        fatherName, parentOccupation, parentAddress, parentMobileNo,
        studentMobileNo, pincode, previousSchool, residentLastYear: residentLastYear === 'on',
        previousHostelName, previousHostelPlace,
        image: req.file ? req.file.buffer.toString('base64') : null, // Convert image to base64
    });

    try {
        await student.save();
        res.send('Form submitted successfully!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving data');
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Vercel deployment requirement
module.exports = app;
