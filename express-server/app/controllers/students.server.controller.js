const Student = require('mongoose').model('Student');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const jwtExpirySeconds = 300;
const jwtKey = config.secretKey;
const Course = require('mongoose').model('Course');
const mongoose = require('mongoose');

exports.getStudentCourses = async function(req, res) {
    try {
        const student = await Student.findById(req.user.id).populate({
            path: 'courses.course',
            select: '_id courseCode courseName sections semester'  
        });
        const courses = student.courses.map(course => ({
            _id: course.course._id,
            courseCode: course.course.courseCode,
            courseName: course.course.courseName,
            section: course.section,
            semester: course.course.semester,
            sections: course.course.sections  
        }));

        res.status(200).json(courses);
    } catch (err) {
        res.status(400).send({
            message: 'Error fetching student courses'
        });
    }
};

exports.addStudentToCourse = async function(req, res) {
    console.log('Request body:', req.body);
    console.log('User ID:', req.user.id);

    try {
        const course = await Course.findById(req.body.courseId);
        if (!course) {
            return res.status(404).send({
                message: 'Course not found'
            });
        }

        const studentId = new mongoose.Types.ObjectId(req.user.id);

        // Fix the enrollment check
        const student = await Student.findById(req.user.id);
        // Check if student is already enrolled in any section of this course
        const isAlreadyEnrolled = student.courses.some(
            enrolledCourse => enrolledCourse.course.toString() === req.body.courseId
        );

        if (isAlreadyEnrolled) {
            return res.status(400).send({
                message: 'Student is already enrolled in a section of this course'
            });
        }

        course.students.push(studentId);
        await course.save();

        student.courses.push({
            course: course._id,
            section: req.body.section
        });
        await student.save();

        res.status(200).json({
            message: 'Successfully enrolled in course',
            course: course
        });
    } catch (err) {
        console.error('Error adding student to course:', err);
        res.status(400).send({
            message: 'Error adding student to course'
        });
    }
};

exports.removeStudentFromCourse = async function(req, res) {
    console.log('Request body:', req.body);
    console.log('User ID:', req.user.id);

    try {
        const course = await Course.findById(req.body.courseId);
        if (!course) {
            return res.status(404).send({
                message: 'Course not found'
            });
        }

        const studentId = new mongoose.Types.ObjectId(req.user.id);

        if (!course.students.some(id => id.equals(studentId))) {
            return res.status(400).send({
                message: 'Student is not enrolled in this course'
            });
        }

        course.students.pull(studentId);
        await course.save();

        const student = await Student.findById(req.user.id);
        const courseIndex = student.courses.findIndex(c => c.course.toString() === req.body.courseId);
        if (courseIndex !== -1) {
            student.courses.splice(courseIndex, 1);
            await student.save();
        }

        res.status(200).json({
            message: 'Successfully removed from course',
            course: course
        });
    } catch (err) {
        console.error('Error removing student from course:', err);
        res.status(400).send({
            message: 'Error removing student from course'
        });
    }
};

const getErrorMessage = function(err){
    var message = '';

    if(err.code){
        switch(err.code){
            case 11000:
            case 11001:
                message = 'Student already exists';
                break;
            default:
                message = 'Something went wrong';
        }
    }
    else{
        for(const errName in err.errors){
            if(err.errors[errName].message) message = err.errors[errName].message;
        }
    }
    return message;
};

// Create a new student
exports.create = async function (req, res, next){
    var student = new Student(req.body);
    console.log("Creating student with data: ", req.body);

    try {
        await student.save();
        console.log("Student created successfully: ", student);
        res.json(student);
    } catch (err) {
        console.error("Error creating student: ", err);
        return next(err);
    }
};

// Return all students
exports.list = async function (req, res, next){
    try {
        const students = await Student.find({});
        res.json(students);
    } catch (err) {
        return next(err);
    }
}

// Display a student
exports.read = function (req, res){
    res.json(req.student);
}

// Find a student by ID
exports.studentByID = async function (req, res, next, id) {
    try {
        const student = await Student.findOne({ _id: id });
        if (!student) {
            return res.status(404).send({
                message: 'Student not found'
            });
        }
        req.student = student;
        next();
    } catch (err) {
        return next(err);
    }
};

// Find a student by student number
exports.studentByNumber = async function (req, res, next) {
    try {
        const student = await Student.findOne({ studentNumber: req.params.studentNumber });
        if (!student) {
            return res.status(404).send({
                message: 'Student not found'
            });
        }
        res.json(student);
    } catch (err) {
        return next(err);
    }
};
exports.updateStudentCourse = async function(req, res) {
    console.log('Request body:', req.body);
    console.log('User ID:', req.user.id);

    try {
        const course = await Course.findById(req.body.courseId);
        if (!course) {
            return res.status(404).send({
                message: 'Course not found'
            });
        }

        const studentId = new mongoose.Types.ObjectId(req.user.id);

        if (!course.students.some(id => id.equals(studentId))) {
            return res.status(400).send({
                message: 'Student is not enrolled in this course'
            });
        }

        // Fixed the course update logic
        const student = await Student.findById(req.user.id);
        const courseIndex = student.courses.findIndex(c => c.course.toString() === req.body.courseId);
        
        if (courseIndex === -1) {
            return res.status(400).send({
                message: 'Course not found in student\'s courses'
            });
        }

        // Update the section
        student.courses[courseIndex].section = req.body.section;
        await student.save();

        res.status(200).json({
            message: 'Successfully updated course section',
            course: course,
            updatedSection: req.body.section
        });
    } catch (err) {
        console.error('Error updating student course:', err);
        res.status(400).send({
            message: 'Error updating student course'
        });
    }
};
// Update a student by ID
exports.update = async function (req, res, next) {
    try {
        const student = await Student.findByIdAndUpdate(req.student.id, req.body, { new: true });
        if (!student) {
            return res.status(404).send({
                message: 'Student not found'
            });
        }
        res.json(student);
    } catch (err) {
        console.log(err);
        return next(err);
    }
};

// Delete a student by ID
exports.delete = async function(req, res, next) {
    try {
        const student = await Student.findByIdAndDelete(req.student.id);
        if (!student) {
            return res.status(404).send({
                message: 'Student not found'
            });
        }
        res.json(student);
    } catch (err) {
        console.error('Error deleting student:', err);
        return next(err);
    }
};

// Authenticate a student
exports.authenticate = async function(req, res, next){
    const studentNumber = req.body.studentNumber;
    const password = req.body.password;

    try {
        console.log('Attempting authentication for student:', studentNumber);
        
        const student = await Student.findOne({ studentNumber: studentNumber });
        if (!student) {
            console.log('Student not found:', studentNumber);
            return res.status(401).send({
                message: 'Authentication failed. Student not found.'
            });
        }

        console.log('Found student:', student.studentNumber);
        console.log('Stored hash:', student.password);
        console.log('Provided password:', password);
        
        // Check if password exists and is a valid bcrypt hash
        if (!student.password || !student.password.startsWith('$2b$')) {
            console.log('Invalid password hash format:', student.password);
            return res.status(401).send({
                message: 'Authentication failed. Invalid password format.'
            });
        }

        const isMatch = await student.authenticate(password);
        console.log('Password match result:', isMatch);

        if (!isMatch) {
            return res.status(401).send({
                message: 'Authentication failed. Wrong password.'
            });
        }

        const token = jwt.sign(
            { 
                id: student._id, 
                isAdmin: student.isAdmin, 
                studentNumber: student.studentNumber 
            }, 
            jwtKey, 
            {
                algorithm: 'HS256',
                expiresIn: jwtExpirySeconds
            }
        );

        res.cookie('token', token, {
            maxAge: jwtExpirySeconds * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/'
        });

        res.json({ 
            success: true,
            token: token,
            student: {
                studentNumber: student.studentNumber,
                isAdmin: student.isAdmin
            }
        });
    } catch (err) {
        console.error('Authentication error:', err);
        return next(err);
    }
};


// Protected page uses the JWT token
exports.welcome = (req, res) =>{
    const token = req.cookies.token;
    console.log(token);

    if(!token){
        return res.status(401).end();
    }
    var payload;
    try{
        payload = jwt.verify(token, jwtKey);
    } catch(e){
        if(e instanceof jwt.JsonWebTokenError){
            return res.status(401).end();
        }
        return res.status(400).end();
    }
    res.send(`${payload.studentNumber}`)
}

// Sign out function in the controller
exports.signout = (req, res) =>{
    res.clearCookie('token')
    return res.status('200').json({message: 'signed out'});
}

// Check if the user is signed in
exports.isSignedIn = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ screen: 'auth' });
    }
    try {
        const payload = jwt.verify(token, jwtKey);
        // Fetch complete student information from database
        const student = await Student.findById(payload.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        // Send complete student information
        res.status(200).json({
            user: {
                id: student._id,
                studentNumber: student.studentNumber,
                isAdmin: student.isAdmin,
                firstName: student.firstName,
                lastName: student.lastName,
                Address: student.Address,
                City: student.City,
                phoneNumber: student.phoneNumber,
                email: student.email,
                program: student.program,
                favoriteCourse: student.favoriteCourse,
                technicalSkills: student.technicalSkills
            }
        });
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ screen: 'auth' });
        }
        return res.status(400).end();
    }
};

// Middleware to check if the user is signed in
exports.requiresLogin = function(req, res, next) {
    // Check for token in cookies or Authorization header
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ screen: 'auth' });
    }

    try {
        const payload = jwt.verify(token, jwtKey);
        console.log('in requiresLogin - payload:', payload);
        req.id = payload.id;
        req.user = payload;
        next();
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ screen: 'auth' });
        }
        return res.status(400).end();
    }
};

// Middleware to check if the user is an admin
exports.requiresAdmin = function(req, res, next) {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
};