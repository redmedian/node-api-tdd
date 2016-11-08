/*
* https://habrahabr.ru/post/308352/
* https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai
*/

// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Book = require('../app/models/book');

// Подключаем dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

// Наш основной блок
describe('Books', () => {

  // Вариант очищения базы
  // Books.collection.drop();

  beforeEach((done) => { // Перед каждым тестом чистим базу
    Book.remove({}, (err) => {
       done();
    });
  });

  /*
  * Тест для /GET
  */
  describe('/GET book', () => {
    it('it should GET all the books', (done) => {
      chai.request(server)
          .get('/book')
          .end((err, res) => {
              res.should.have.status(200);  // Статус должен быть 200.
              res.should.be.json; // Результат должен быть в JSON-формате.
              res.body.should.be.a('array');  // Результат должен быть массивом.
              res.body.length.should.be.eql(0);  // Так как база пуста, мы ожидаем что размер массива будет равен 0.
            done();
          });
      });
  });

  /*
  * Тест для /POST
  */
  describe('/POST book', () => {
    it('it should not POST a book without pages field', (done) => {
      let book = {
          title: "The Lord of the Rings",
          author: "J.R.R. Tolkien",
          year: 1954
      }
      chai.request(server)
          .post('/book')
          .send(book) // Обратите внимание, что мы отправили данные о книге с помощью метода .send().
          .end((err, res) => {
              res.should.have.status(200) // Статус должен быть 200.
              res.should.be.json; // Результат должен быть в JSON-формате.
              res.body.should.be.a('object'); // Тело ответа должно быть объектом.
              res.body.should.have.property('errors'); // Одним из свойств тела ответа должно быть errors.
              res.body.errors.should.have.property('pages'); // У поля errors должно быть пропущенное в запросе свойство pages.
              res.body.errors.pages.should.have.property('kind').eql('required'); // pages должно иметь свойство kind равное required чтобы показать причину почему мы получили негативный ответ от сервера.
            done();
          });
    });
    it('it should POST a book ', (done) => {
      let book = {
          title: "The Lord of the Rings",
          author: "J.R.R. Tolkien",
          year: 1954,
          pages: 1170
      }
      chai.request(server)
          .post('/book')
          .send(book)
          .end((err, res) => {
              res.should.have.status(200); // Статус должен быть 200.
              res.should.be.json; // Результат должен быть в JSON-формате.
              res.body.should.be.a('object'); // Тело ответа должно быть объектом.
              res.body.should.have.property('message').eql('Book successfully added!');
              res.body.book.should.have.property('title'); // Тело ответа должно иметь значение равное полю title.
              res.body.book.should.have.property('author'); // Тело ответа должно иметь значение равное полю author.
              res.body.book.should.have.property('pages'); // Тело ответа должно иметь значение равное полю pages.
              res.body.book.should.have.property('year'); // Тело ответа должно иметь значение равное полю year.
            done();
          });
    });
  });

  /*
  * Тест для /GET/:ID
  */
  describe('/GET/:id book', () => {
    it('it should GET a book by the given id', (done) => {
      let book = new Book({
          title: "The Lord of the Rings",
          author: "J.R.R. Tolkien",
          year: 1954,
          pages: 1170
      });
      book.save((err, book) => {
          chai.request(server)
          .get('/book/' + book.id)
          .send(book)
          .end((err, res) => {
              res.should.have.status(200);
              res.should.be.json;
              res.body.should.be.a('object');
              res.body.should.have.property('title');
              res.body.should.have.property('author');
              res.body.should.have.property('pages');
              res.body.should.have.property('year');
              res.body.should.have.property('_id').eql(book.id);
            done();
          });
      });
    });
  });

  /*
  * Тест для /PUT/:ID
  */
  describe('/PUT/:id book', () => {
    it('it should UPDATE a book given the id', (done) => {
      let book = new Book({
        title: "The Chronicles of Narnia",
        author: "C.S. Lewis",
        year: 1948,
        pages: 778
      })
      book.save((err, book) => {
          chai.request(server)
          .put('/book/' + book.id)
          .send({
            title: "The Chronicles of Narnia",
            author: "C.S. Lewis",
            year: 1950,
            pages: 778
          })
          .end((err, res) => {
              res.should.have.status(200);
              res.should.be.json;
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('Book updated!');
              res.body.book.should.have.property('year').eql(1950);
            done();
          });
      });
    });
  });

  /*
  * Тест для /DELETE/:ID
  */
  describe('/DELETE/:id book', () => {
    it('it should DELETE a book given the id', (done) => {
      let book = new Book({
        title: "The Chronicles of Narnia",
        author: "C.S. Lewis",
        year: 1948,
        pages: 778
      })
      book.save((err, book) => {
          chai.request(server)
          .delete('/book/' + book.id)
          .end((err, res) => {
              res.should.have.status(200);
              res.should.be.json;
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('Book successfully deleted!');
              res.body.result.should.have.property('ok').eql(1);
              res.body.result.should.have.property('n').eql(1);
            done();
          });
      });
    });
  });

});
