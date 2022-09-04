const mongoose = require('mongoose')
const Comment = require('./comment')

const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    comments: {
        type: [String],
        required: false,
        default: []
    }
})

bookSchema.pre(/^find/, function (next) {
    this.select('-__v')
    next();
})

const Book = mongoose.model('Book', bookSchema)

module.exports = Book;
