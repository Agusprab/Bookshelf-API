const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    const {
 name, year, author, summary, publisher, pageCount, readPage, reading,
} = request.payload;

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = (pageCount === readPage);

    const newBook = {
        id, name, publisher, year, author, summary, pageCount, readPage, finished, reading, insertedAt, updatedAt,
    };

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    books.push(newBook);
    const isSuccess = books.filter((book) => book.id === id).length > 0;
    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
      });
      response.code(500);
      return response;
};

const getAllBooksHandler = (request) => {
  const { name, reading, finished } = request.query;

  if (Number(reading) === 1) {
     const bookFiltered = books.filter((book) => book.reading === true);
     return {
        status: 'success',
        data: {
            books: bookFiltered.map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
          },
      };
  }
  if (Number(reading) === 0) {
    const bookFiltered = books.filter((book) => book.reading === false);
    return {
        status: 'success',
        data: {
            books: bookFiltered.map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
          },
      };
  }

  if (Number(finished) === 1) {
    const bookFiltered = books.filter((book) => book.finished === true);
    return {
        status: 'success',
        data: {
            books: bookFiltered.map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
          },
      };
  }
  if (Number(finished) === 0) {
    const bookFiltered = books.filter((book) => book.finished === false);
    return {
        status: 'success',
        data: {
            books: bookFiltered.map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
          },
      };
  }
  if (name !== undefined) {
    const bookFiltered = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    return {
        status: 'success',
        data: {
            books: bookFiltered.map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
          },
      };
  }
  return {
    status: 'success',
    data: {
      books: books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  };
};

const getBookByIdHandler = (request, h) => {
    const { id } = request.params;
  const book = books.filter((n) => n.id === id)[0];

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                  book,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

const editBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const {
 name, year, author, summary, publisher, pageCount, readPage, reading,
} = request.payload;
    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === id);
    if (index !== -1) {
        if (!name) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku',
});
            response.code(400);
            return response;
        }
        if (readPage > pageCount) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
});
            response.code(400);
            return response;
        }
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
        };
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
});
    response.code(404);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const index = books.findIndex((book) => book.id === id);
    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
});
    response.code(404);
    return response;
};

module.exports = {
    addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler,
};
