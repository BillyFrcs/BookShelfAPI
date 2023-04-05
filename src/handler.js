const { nanoid } = require('nanoid');
const books = require('./books');

const addBook = (request, handler) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    if (name === undefined) {
        const response = handler.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        });

        response.code(400);

        return response;
    } else if (readPage > pageCount) {
        const response = handler.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        });

        response.code(400);

        return response;
    }

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt };

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
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

    const response = handler.response({
        status: 'fail',
        message: 'Internal Server Error'
    });

    response.code(500);

    return response;
};

const getAllBooks = (request, handler) => {
    const { name, reading, finished } = request.query;

    let filteredBooks = books;

    if (name !== undefined) {
        filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    } else if (reading !== undefined) {
        filteredBooks = filteredBooks.filter((book) => Boolean(book.reading) === Boolean(reading));
    } else if (finished !== undefined) {
        filteredBooks = filteredBooks.filter((book) => Number(book.finished) === Number(finished));
    }

    const response = handler.response({
        status: 'success',
        data: {
            books: filteredBooks.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher
            }))
        }
    });

    response.code(200);

    return response;
};

const getSpecifiedBook = (request, handler) => {
    const { id } = request.params;

    const index = books.findIndex((b) => b.id === id);

    if (index === -1) {
        const response = handler.response({
            status: 'fail',
            message: 'Buku tidak ditemukan'
        });

        response.code(404);

        return response;
    }

    const response = handler.response({
        status: 'success',
        data: {
            book: books[index]
        }
    });

    return response;

    /*
    const { id } = request.params;

    const book = books.filter((b) => b.id === id)[0];

    if (book === undefined) {
        const response = handler.response({
            status: 'fail',
            message: 'Buku tidak ditemukan'
        });

        response.code(404);

        return response;
    }

    const response = handler.response({
        status: 'success',
        data: {
            book
        }
    });

    return response;
    */
};

const updateBook = (request, handler) => {
    const { id } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    if (!name) {
        const response = handler.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        });

        response.code(400);

        return response;
    } else if (readPage > pageCount) {
        const response = handler.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        });

        response.code(400);

        return response;
    }

    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        const updatedAt = new Date().toISOString();
        const finished = (pageCount === readPage);

        books[index] = {
            ...books[index], name, year, author, summary, publisher, pageCount, readPage, finished, reading, updatedAt
        };

        const response = handler.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        });

        response.code(200);

        return response;
    }

    const response = handler.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
    });

    response.code(404);

    return response;
};

const deleteBook = (request, handler) => {
    const { id } = request.params;

    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books.splice(index, 1);

        const response = handler.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        });

        response.code(200);

        return response;
    }

    const response = handler.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    });

    response.code(404);

    return response;
};

module.exports = { addBook, getAllBooks, getSpecifiedBook, updateBook, deleteBook };