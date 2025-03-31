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
    },


    //for like button
    likedBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    //for comments
    comments: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: 'Comment user is required'
        },
        content: {
            type: String,
            required: 'Comment content cannot be empty',
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        },
        replies: [{
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: 'Reply user is required'
            },
            content: {
                type: String,
                required: 'Reply content cannot be empty',
                trim: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            updatedAt: {
                type: Date,
                default: Date.now
            }
        }],

    }],
    //for ratings
    ratings: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        score: {
            type: Number,
            required: true,
            min: 1,
            max: 5  // Typical 5-star rating system
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        },
    }],
    // Add calculated average rating for quick access
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    ratingCount: {
        type: Number,
        default: 0,
        min: 0
    },

    // Add calculated likes count for quick access
    likesCount: {
        type: Number,
        default: 0,
        min: 0
    },

}, { timestamps: true });

// Create a compound index to ensure a user can only rate a recipe once
RecipeTemplateSchema.index({
    _id: 1,
    'ratings.user': 1
}, {
    unique: true,
    partialFilterExpression: { 'ratings.user': { $exists: true } }
});

// Create an index for efficient lookup of who liked a recipe
RecipeTemplateSchema.index({ 'likedBy': 1 });

// Middleware to update averageRating and likesCount 
RecipeTemplateSchema.pre('save', function (next) {
    // Update ratings average and count
    if (this.ratings && this.ratings.length > 0) {
        const totalScore = this.ratings.reduce((sum, rating) => sum + rating.score, 0);
        this.averageRating = Number((totalScore / this.ratings.length).toFixed(1)); // Round to 1 decimal place
        this.ratingCount = this.ratings.length;
    } else {
        this.averageRating = 0;
        this.ratingCount = 0;
    }

    // Update likes count
    if (this.likedBy) {
        this.likesCount = this.likedBy.length;
    } else {
        this.likesCount = 0;
    }

    next();
});


mongoose.model('RecipeTemplate', RecipeTemplateSchema);
