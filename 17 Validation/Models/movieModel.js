const mongoose = require('mongoose');
const fs = require('fs');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required field!'],        //Data Validator
        unique: true,                                       //Not a data validator
        maxlength: [100, "Movie name must not have more than 100 characters"],  // maxlength BuiltinData Validator
        minlength: [4, "Movie name must have at least 4 charachters"],          // minlength Data Validator
        //trim remove spaces at start and end of string
        trim: true,
        //the below is a custom validator
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
        //max: [10, "rating must be below 10"],
        //min: [1, "rating must be above 1"],
        //The below is a custom validator assigned to validate key  
        /*validate: {
            validator: function(value){
                return value >= 1 && value <= 10;
            },
            message: "Ratings ({VALUE}) should be above 1 and below 10"
        }*/


            /*
            we dont use this because if we do this only works during creation but not updation
            //during creation this points to the creation document but during updation it doesnt
            //because many updation methods dont run validators so
                validate: {
                    validator: function(value){
                        return this.value >= 1 && this.value <= 10;
                    },
                    message: "Ratings ({VALUE}) should be above 1 and below 10"
                }
            */

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
        //The values in genre array should eb the values in the enum
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


const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;