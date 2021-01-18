const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({title: 'novo titulo'})
        .end(function (err,res){
          assert.equal(res.status, 200);
          assert.equal(res.body.title, 'novo titulo')
          assert.isArray(res.body.comments);
          idToDelete = res.body._id;
          assert.property(res.body,'_id');
          
          done();
        })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({})
        .end(function (err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, "missing required field title");
          done();
        })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end(function (err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          done();
        })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books/falseid')
        .end(function (err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get('/api/books/6005d98f91b3d6025419fc08')
        .end(function (err, res){
          assert.equal(res.status, 200);
          id = res.body._id
          assert.equal(id, '6005d98f91b3d6025419fc08');
          assert.equal(res.body.title, 'Livro Novo');
          assert.isArray(res.body.comments);
          done();
        })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
        .post('/api/books/6005d98f91b3d6025419fc08')
        .send({comment: 'New Comment'})
        .end(function (err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.title, 'Livro Novo');
          expect(res.body.comments).to.include('New Comment');
          done();
        })
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
        .post('/api/books/6005d18891b3d6025419fc07')
        .send({comment: ''})
        .end(function (err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'missing required field comment');
          done();
        })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
        .post('/api/books/6005d18891b3d6025419fc07fake')
        .send({comment: '421'})
        .end(function (err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        })
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
        .delete(`/api/books/${idToDelete}`)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'delete successful');
          done()
        })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
        .delete('/api/books/falseid317497')
        .end(function (err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        })
      });

    });

  });

});
