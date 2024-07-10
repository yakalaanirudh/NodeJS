const mongoose = require('mongoose');
const fs = require('fs');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required field!'],
        unique: true,
        maxlength: [100, "Movie name must not have more than 100 characters"],
        minlength: [4, "Movie name must have at least 4 charachters"],
        //trim remove spaces at start and end of string
        trim: true,
        //validate: [validator.isAlpha, "Name should only contain alphabets."]
    },
    description: {
        type: String,
        required: [true, 'Description is required field!'],
        trim: true
    },
    duration: {
        type: Number,
        required: [true, 'Duration is required field!']
    },
    ratings: {
        type: Number,
        /*validate: {
            validator: function(value){
                return value >= 1 && value <= 10;
            },
            message: "Ratings ({VALUE}) should be above 1 and below 10"
        }*/
    },
    totalRating: {
        type: Number
    },
    releaseYear: {
        type: Number,
        required: [true, 'Release year is required field!']
    },
    releaseDate:{
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    genres: {
        type: [String],     //Is an array of string valuess
        required: [true, 'Genres is required field!'],
        // enum: {
        //      values: ["Action", "Adventure", "Sci-Fi", "Thriller", "Crime", "Drama", "Comedy", "Romance", "Biography"],
        //      message: "This genre does not exist"
        // }
    },
    directors: {
        type: [String],
        required: [true, 'Directors is required field!']
    },
    coverImage:{
        type: String,
        require: [true, 'Cover image is required field!']
    },
    actors: {
        type: [String],
        require: [true, 'actors is required field!']
    },
    price: {
        type: Number,
        require: [true, 'Price is required field!']
    },
    createdBy: String
},
/* {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
}
*/
);

//In a document middleware this points to the current document
//flag:a is for append
movieSchema.pre('save', function(next) {
    //console.log(this)                     //this logs the object we created or we are trying to save
    this.createdBy = 'Anirudh Yakala';
    next();
})

movieSchema.post('save', function(doc, next){
    const content = `A new movie document with name ${doc.name} has been created by ${doc.createdBy}\n`;
    fs.writeFileSync('./Log/log.txt', content, {flag: 'a'}, (err) => {
        console.log(err.message);
    });
    next();
});


const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;