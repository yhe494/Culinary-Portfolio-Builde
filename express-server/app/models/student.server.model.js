const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Schema = mongoose.Schema;

var StudentSchema = new Schema({
    studentNumber:{
        type: String,
        required: 'Student number is required',
        trim: true,
        default: '',
        unique: true,
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        validate: [
            (password) => password && password.length > 6,
            'Password should be longer'
        ]
    },
    firstName: String,
    lastName: String,
    Address: String,
    City: String,
    phoneNumber:{
        type: String,
        match: [/^\d{10}$/, 'Please fill a valid phone number']
    },
    email: {
        type: String,
        unique: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    program: String,
    favoriteCourse: String,
    technicalSkills: String,
    courses: [{
        course: {
            type: Schema.ObjectId,
            ref: 'Course'
        },
        section: String
    }]
});

// Add a method to check if a string looks like it's already hashed
StudentSchema.methods.isHashed = function(str) {
    // bcrypt hashes are 60 characters long and start with $2b$
    return /^\$2[aby]\$\d+\$/.test(str);
};

StudentSchema.pre('save', async function(next) {
    // Only hash the password if it's modified and not already hashed
    if ((this.isModified('password') || this.isNew) && !this.isHashed(this.password)) {
        try {
            const hash = await bcrypt.hash(this.password, saltRounds);
            this.password = hash;
            next();
        } catch (err) {
            return next(err);
        }
    } else {
        return next();
    }
});

StudentSchema.methods.authenticate = async function(password) {
    try {
        console.log('Comparing passwords:');
        console.log('Input password:', password);
        console.log('Stored hash:', this.password);
        
        const isMatch = await bcrypt.compare(password, this.password);
        console.log('bcrypt.compare result:', isMatch);
        
        return isMatch;
    } catch (err) {
        console.error('Error in password comparison:', err);
        throw err;
    }
};
StudentSchema.virtual('fullName').get(function() {
    return this.firstName + ' ' + this.lastName;
}).set(function(fullName) {
    const splitName = fullName.split(' ');
    this.firstName = splitName[0] || '';
    this.lastName = splitName[1] || '';
});

StudentSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

mongoose.model('Student', StudentSchema);