/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const Book = require('../models/book')

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
        const books = await Book.find().lean();

        for (let book of books) {
          book.commentcount = book.comments.length;
          delete book.comments;
        }

        return res.json(books)

      } catch (error) {
        console.log(error)
        return res.json({ error: 'something wrong happened.' })
      }

    })

    .post(async (req, res) => {
      let title = req.body.title;

      if (!title)
        return res.send('missing required field title')

      try {
        let book = await Book.create({ title });
        return res.json({ _id: book.id, title })
      } catch (error) {
        return res.send('error occured.')
      }

      //response will contain new book object including atleast _id and title
    })

    .delete(async function (req, res) {
      //if successful response will be 'complete delete successful'
      try {
        await Book.remove({})
        return res.json('complete delete successful')
      } catch (error) {
        return res.send('something wrong happened.')
      }
    });



  app.route('/api/books/:id')
    .get(async function (req, res) {
      try {
        let bookid = req.params.id;
        const book = await Book.findOne({ _id: bookid })
        if (!book) return res.json('no book exists')

        return res.json(book)
      } catch (err) {
        return res.send('something wrong happened.')
      }

      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      return res.json({ error: 'missing _id' });
    })

    .post(async function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;

      if (!comment) return res.send('missing required field comment')

      try {
        const book = await Book.findOne({ _id: bookid });
        if (!book) return res.send('no book exists')

        book.comments.push(comment);
        await book.save();

        return res.json(book)
      } catch (error) {
        return res.send('something wrong happened.')
      }
      //json res format same as .get
    })

    .delete(async function (req, res) {
      let bookid = req.params.id;
      try {
        const book = await Book.findOne({ _id: bookid })
        if (!book) return res.send('no book exists')

        await book.delete()

        return res.send('delete successful')
      } catch (error) {
        return res.send('something wrong happended.')
      }
      //if successful response will be 'delete successful'
    });

};
