const express = require('express');
const userRouter = require('./controller/userController');
const transferRouter = require('./controller/transferController');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
app.use(express.json());

// Swagger endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// User endpoints
app.use('/', userRouter);

// Transfer endpoints
app.use('/transfer', transferRouter);

module.exports = app;
