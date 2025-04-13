const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Schema = mongoose.Schema;

var UserSchema = new Schema({
    email: {
        type: String,
        required: 'Email is required',
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: 'Password is required',
        validate: [
            (password) => password && password.length > 6,
            'Password should be longer than 6 characters'
        ]
    },
    firstName: {
        type: String,
        required: 'First name is required',
        trim: true
    },
    lastName: {
        type: String,
        required: 'Last name is required',
        trim: true
    },
    phoneNumber: {
        type: String,
        match: [/^\d{10}$/, 'Please fill a valid phone number']
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    profile: {
        bios: {
            type: String,
            default: ''
        },
        website: {
            type: String,
            default: ''
        }
    }
}, { timestamps: true });

// Add a method to check if a string looks like it's already hashed
UserSchema.methods.isHashed = function (str) {
    // bcrypt hashes are 60 characters long and start with $2b$
    return /^\$2[aby]\$\d+\$/.test(str);
};

UserSchema.pre('save', async function (next) {
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

UserSchema.methods.authenticate = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (err) {
        console.error('Error in password comparison:', err);
        throw err;
    }
};

UserSchema.virtual('fullName').get(function () {
    return this.firstName + ' ' + this.lastName;
}).set(function (fullName) {
    const splitName = fullName.split(' ');
    this.firstName = splitName[0] || '';
    this.lastName = splitName[1] || '';
});

UserSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

mongoose.model('User', UserSchema); 