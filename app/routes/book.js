let mongoose = require('mongoose');
let Book = require('../models/book');

/*
 * GET /book маршрут для получения списка всех книг.
 */
function getBooks(req, res) {
    //Сделать запрос в базу и, если не ошибок, отдать весь список книг
    let query = Book.find({});
    query.exec((err, books) => {
        if(err) res.send(err);
        //если нет ошибок, отправить клиенту
        res.json(books);
    });
}

/*
 * POST /book для создания новой книги.
 */
function postBook(req, res) {
    //Создать новую книгу
    var newBook = new Book(req.body);
    //Сохранить в базу.
    newBook.save((err,book) => {
        if(err) {
            res.send(err);
        }
        else { //Если нет ошибок, отправить ответ клиенту
            res.json({message: "Book successfully added!", book });
        }
    });
}

/*
 * GET /book/:id маршрут для получения книги по ID.
 */
function getBook(req, res) {
    Book.findById(req.params.id, (err, book) => {
        if(err) res.send(err);
        //Если нет ошибок, отправить ответ клиенту
        res.json(book);
    });
}

/*
 * DELETE /book/:id маршрут для удаления книги по ID.
 */
function deleteBook(req, res) {
    Book.remove({_id : req.params.id}, (err, result) => {
        res.json({ message: "Book successfully deleted!", result });
    });
}

/*
 * PUT /book/:id маршрут для редактирования книги по ID
 * В этой функции мы используем Object.assign, новую функцию ES6, которая перезаписывает общие свойства book и req.body и оставляет.остальные нетронутыми
 */
function updateBook(req, res) {
    Book.findById({_id: req.params.id}, (err, book) => {
        if(err) res.send(err);
        Object.assign(book, req.body).save((err, book) => {
            if(err) res.send(err);
            res.json({ message: 'Book updated!', book });
        });
    });
}

//экспортируем все функции
module.exports = { getBooks, postBook, getBook, deleteBook, updateBook };
