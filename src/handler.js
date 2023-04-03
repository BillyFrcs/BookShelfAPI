const { nanoid } = require('nanoid');
const books = require('./books');

const addBook = (request, handler) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const id = nanoid(16);
    const finished = false;
    const insertedAt = new Date().toISOString();
    const updateAt = insertedAt;

    const newBook = { name, year, author, summary, publisher, pageCount, readPage, reading, id, finished, insertedAt, updateAt };

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        if (name.length === 0) {
            const response = handler.response({
                status: 'fail',
                message: 'Gagal menambahkan buku. Mohon isi nama buku'
            });
        
            response.code(400);
    
            return response;
        }
        else if (readPage > pageCount) {
            const response = handler.response({
                status: 'fail',
                message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
            });
        
            response.code(400);
        
            return response;
        }
        else {
            const response = handler.response({
                status: 'success',
                message: 'Buku berhasil ditambahkan',
                data: {
                    bookId: id
                }
            });
    
            response.code(201);
    
            return response;
        }
    }

    const response = handler.response({
        status: 'fail',
        message: 'Internal Server Error'
    });

    response.code(500);

    return response;
};

module.exports = { addBook };
