const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    courseCode: {
        type: String,
        required: 'Course code is required',
        trim: true
    },
    courseName: {
        type: String,
        required: 'Course name is required',
        trim: true
    },
    sections: [String],
    semester: String,
    students: [{
        type: Schema.ObjectId,
        ref: 'Student'
    }]
});

mongoose.model('Course', CourseSchema);