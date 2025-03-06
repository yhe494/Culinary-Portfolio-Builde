const mongoose = require('mongoose');
const Course = mongoose.model('Course');

exports.list = async function(req, res) {
    try {
        const courses = await Course.find().sort('courseCode');
        res.status(200).json(courses);
    } catch (err) {
        res.status(400).send({
            message: 'Error fetching courses'
        });
    }
};

exports.create = async function(req, res) {
    const course = new Course(req.body);
    try {
        await course.save();
        res.status(201).json(course);
    } catch (err) {
        res.status(400).send({
            message: 'Error creating course'
        });
    }
};

exports.read = function(req, res) {
    res.status(200).json(req.course);
};

exports.update = async function(req, res) {
    try {
        const course = await Course.findByIdAndUpdate(req.course._id, req.body, { new: true });
        res.status(200).json(course);
    } catch (err) {
        res.status(400).send({
            message: 'Error updating course'
        });
    }
};

exports.delete = async function(req, res) {
    try {
        await Course.findByIdAndRemove(req.course._id);
        res.status(200).json(req.course);
    } catch (err) {
        res.status(400).send({
            message: 'Error deleting course'
        });
    }
};

exports.courseByID = async function(req, res, next, id) {
    try {
        const course = await Course.findById(id).populate('students');
        if (!course) {
            return next(new Error('Failed to load course ' + id));
        }
        req.course = course;
        next();
    } catch (err) {
        return next(err);
    }
};

exports.getStudentsByCourseCode = async function(req, res) {
    try {
        const course = await Course.findOne({ courseCode: req.params.courseCode }).populate('students');
        if (!course) {
            return res.status(404).send({
                message: 'Course not found'
            });
        }
        console.log('Course found:', course);
        res.status(200).json({ students: course.students });
    } catch (err) {
        console.error('Error fetching students for course:', err);
        res.status(400).send({
            message: 'Error fetching students for course'
        });
    }
};