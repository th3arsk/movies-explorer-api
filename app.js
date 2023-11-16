require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');

const { PORT, DB_ADRESS } = process.env;
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { signIn, signUp } = require('./controllers/users');
const { validateSignIn, validateSignUp } = require('./middlewares/validation');

const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');

const app = express();
app.use(express.json());

app.use(requestLogger);
app.use(cors());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', validateSignIn, signIn);
app.post('/signup', validateSignUp, signUp);

app.use(auth, userRouter);
app.use(auth, movieRouter);

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });

  next();
});

mongoose.connect(DB_ADRESS, {});

app.listen(PORT, () => {
  console.log(`
слушаем порт ${PORT},
сервер активен`);
});
