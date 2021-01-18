'use strict';
const mongoose = require('mongoose');
const BOOK = require('../models').BOOK;
const ObjectId = mongoose.Types.ObjectId;

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      BOOK.find({}, (err, data) => {
        if(err) {res.json({error: 'error fetching data'})}
        var response = [];
        data.forEach(book => {
          response.push({'_id': book._id, 'title': book.title, 'commentcount': book.comments.length})
        }) 
        res.json(response);
      })
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      let title = req.body.title;
      if(!title) {
        res.send("missing required field title");
        return;
      }

      const newBook = new BOOK({
        title
      });

      newBook.save((err, data) => {
        if(err) { res.send("Error returning data")}
        res.json(newBook);
      })
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      BOOK.deleteMany({}, (err, data) => {
        if(err) { res.json({error: 'delete failed'})}
        res.send("complete delete successful");
        return;
      });

      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      const fetchBook = BOOK.findById(bookid, (err, book) => {
        if(err || !book) {res.send("no book exists");
                          return;}

        res.json({'_id': book.id, 'title': book.title, 'comments': book.comments})
      })
       //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      if(!comment) { 
        res.send("missing required field comment");
        return;
      }

      const fetchBook = BOOK.findById(bookid, (err, book) => {
        if(err) { res.send("no book exists") 
                  return;}
        if(!book) { res.send("no book exists") 
                  return;}

        book.comments.push(comment);
        book.save((err, data) =>{
          if(err) {res.send("Error saving the data")
                  return;}
          res.json({'_id': book._id, 'title': book.title, 'comments': book.comments})
        })

      })

      //json res format same as .get
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      if(!bookid) {res.json("no book exists");
                  return;}
      const fetchBook = BOOK.findByIdAndDelete(bookid, (err, book) => {
        if(err || !book) {res.send("no book exists");
        return;}
        res.send("delete successful");
      });
      });

      //if successful response will be 'delete successful'
  
};
