const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const DEFAULT_DB_ADRESS = require('./utils/config');

const { PORT = 3003, DB_ADRESS = DEFAULT_DB_ADRESS } = process.env;

const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const { router } = require('./routes/index');

const app = express();
app.use(express.json());
app.use(helmet());

app.use(requestLogger);
app.use(cors());

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose.connect(DB_ADRESS, {});

app.listen(PORT, () => {
  console.log(`
слушаем порт ${PORT},
сервер активен`);
});
