const { addBook, getAllBooks, getSpecifiedBook, updateBook, deleteBook } = require('./handler');

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: addBook,
        options: {
            cors: {
                origin: ['*']
            }
        }
    },
    {
        method: 'GET',
        path: '/books',
        handler: getAllBooks
    },
    {
        method: 'GET',
        path: '/books/{id}',
        handler: getSpecifiedBook
    },
    {
        method: 'PUT',
        path: '/books/{id}',
        handler: updateBook
    },
    {
        method: 'DELETE',
        path: '/books/{id}',
        handler: deleteBook
    }
];

module.exports = routes;