const mongoose = require('mongoose')

const schema = mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    bookId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Book',
        required: true,
    }
})

schema.index({ book: 1 })

const Comment = mongoose.model('Comment', schema)

module.exports = Comment;
