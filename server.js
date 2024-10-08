const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const dotenv = require('dotenv');
const cors = require('cors');
const Student = require('./models/Student');

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
app.post('/formSubmit', upload.single('image'), async (req, res) => {
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

// Endpoint to get all student documents
app.get('/studentData', async (req, res) => {
    try {
        const students = await Student.find(); // Retrieve all student documents
        res.json(students); // Send the documents as JSON response
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching student data');
    }
});

// New DELETE endpoint to delete a student document by ID
app.delete('/delete', async (req, res) => {
    const { id } = req.body; // Get the ID from the request body

    try {
        const result = await Student.findByIdAndDelete(id); // Delete the document by ID
        if (result) {
            res.send(`Student with ID ${id} deleted successfully!`);
        } else {
            res.status(404).send(`No student found with ID ${id}`);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting student data');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Vercel deployment requirement
module.exports = app;
