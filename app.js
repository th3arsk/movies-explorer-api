require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');

const { PORT = 3003, DB_ADRESS = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
const NotFoundError = require('./errors/NotFoundError');

const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const { authRouter, router } = require('./routes/index');

const app = express();
app.use(express.json());
app.use(helmet());

app.use(requestLogger);
app.use(cors());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(authRouter);
app.use(auth, router);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose.connect(DB_ADRESS, {});

app.listen(PORT, () => {
  console.log(`
слушаем порт ${PORT},
сервер активен`);
});
