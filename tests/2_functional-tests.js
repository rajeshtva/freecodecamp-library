/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const Book = require('../models/book');
const { default: mongoose } = require('mongoose');

chai.use(chaiHttp);

suite('Functional Tests', function () {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function (done) {
  //   chai.request(server)
  //     .get('/api/books')
  //     .end(function (err, res) {
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function () {

    suite('POST /api/books with title => create book object/expect book object', function () {

      test('Test POST /api/books with title', function (done) {
        chai.request(server).post('/api/books').send({ title: 'it is a title' }).end((err, res) => {
          assert.equal(res.status, 200);
          console.log(res.body)
          // assert.equal(res.body.title, 'it is a title')
        })
        done();
      });

      test('Test POST /api/books with no title given', async function (done) {
        chai.request(server)
          .post('/api/books')
          .send({ title: '' }).end((err, res) => {
            assert.equal(res.status, 200);
            assert.notProperty(res.body, 'title')
            assert.equal(res.text, 'missing required field title')
          })

        done();
      });


    });


    suite('GET /api/books => array of books', function () {

      test('Test GET /api/books', async function () {
        await Book.insertMany([{ title: 'something worth nothing.' }]);

        chai.request(server).get('/api/books').end((err, res) => {
          assert.equal(res.status, 200);
          assert.notEqual(res.body.length, 0);
          assert.hasAllKeys(res.body[0], ['title', 'commentcount', '_id']);
        })
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function () {

      test('Test GET /api/books/[id] with id not in db', function (done) {

        chai.request(server).get('/api/books/something').end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.text, 'no book exists')
        })
        done();
      });

      test('Test GET /api/books/[id] with valid id in db', async function () {
        const book = await Book.create({ title: 'prabhu' })

        chai.request(server).get(`/api/books/${book._id.toString()}`).end((err, res) => {
          assert.equal(res.status, 200);
          assert.hasAllKeys(res.body, ['title', 'comments', '_id']);
        })
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', async function () {

      test('Test POST /api/books/[id] with comment', async function () {
        const book = await Book.create({ title: 'nautilus', comments: ['some random bad comment whi'] });

        chai.request(server).post(`/api/books/${book._id.toString()}`)
          .type('form')
          .send({ comment: 'another random comment.' }).end((err, res) => {
            assert.equal(res.body.comments?.length, 2);
            assert.equal(res.status, 200);
          })
      });

      test('Test POST /api/books/[id] without comment field', async function () {
        const book = await Book.create({ title: 'goals', comments: [] });

        chai.request(server).post(`/api/books/${book._id.toString()}`).send({}).end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'missing required field comment');
        })
      });

      test('Test POST /api/books/[id] with comment, id not in db', async function () {
        const book = await Book.create({ title: 'tattoo', comments: [] });

        chai.request(server).post(`/api/books/${book._id.toString()}`).type('form').send({}).end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
        })
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function () {

      test('Test DELETE /api/books/[id] with valid id in db', async function () {
        const book = await Book.create({ title: 'the deleted book' });

        chai.request(server).delete(`/api/books/${book._id.toString()}`).end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'delete successful');
        })
      });

      test('Test DELETE /api/books/[id] with id not in db', async function () {
        //done();
        let a = new mongoose.Types.ObjectId;
        chai.request(server).delete(`/api/books/${a.toString()}`).end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
        })
      });

    });

  });

});
