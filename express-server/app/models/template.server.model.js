const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecipeTemplateSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    categories: [{
        type: String,
        enum: ['Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Other'],
        required: true
    }],
    image: {
        type: String,  // URL or path to the image
        required: false
    },
    ingredients: {        
        type: Schema.Types.Mixed,  // Using Mixed to simulate List behavior in MongoDB
        required: true
    },
    steps: [{
        type: String,
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',  // References the User model
        required: true
    },
    isPublic: {
        type: Boolean,
        default: true  // Control whether the template is public or private
    },
    versions: [{
        versionNumber: {
            type: Number,
            default: 1
        },
        date: {
            type: Date,
            default: Date.now
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        changes: {
            type: String  // Description of what was updated in this version
        }
    }],
    isReusable: {
        type: Boolean,
        default: true  // Control whether this template can be reused by others
    }
}, { timestamps: true });

mongoose.model('RecipeTemplate', RecipeTemplateSchema);
