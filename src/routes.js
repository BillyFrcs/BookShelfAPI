const { addBook } = require('./handler');

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
];

module.exports = routes;
