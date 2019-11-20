import * as createError from 'http-errors';
import * as express from "express";
import * as path from "path";
import * as cookieParser from 'cookie-parser';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import { MongooseConn } from "./mongooseConn";

import { IndexRouter } from "./routes/indexRouter";
import { CatalogRouter } from "./routes/catalogRouter";
import errorMiddleware from './middleware/error.middleware';

const app = express();

// Configure application
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/../public')));
// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Router
app.use('/', new IndexRouter().router);
app.use('/catalog', new CatalogRouter().router);

// Error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// Error handler
app.use(errorMiddleware);

dotenv.config({ path: path.resolve(__dirname, '../.env') })

// Connect DB
const mongooseConn = new MongooseConn();
mongooseConn.initConn();

export = app;