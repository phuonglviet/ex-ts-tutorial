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

/**
 * Application.
 *
 * @class App
 */
export class App {

	/**
   * Bootstrap the application.
   *
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
    public static bootstrap(): App {
        return new App();
    }

    public app: express.Application;

    /**
   * Constructor.
   *
   * @constructor
   */
    constructor() {
        dotenv.config();
        this.app = express();
        this.setConfig();
        this.setRoutes();
        this.setErrorHandler();
        this.connectToTheDatabase();
        // this.initializeErrorHandling();
    }

    /**
     * Configure application
     *
     */
    private setConfig(): void {
        // view engine setup
        this.app.set('views', path.join(__dirname, 'views'));
        this.app.set('view engine', 'pug');

        this.app.use(logger('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(cookieParser());
        this.app.use(express.static(path.join(__dirname, '/../public')));
        // this.app.use(express.static(path.join( __dirname, '../public')));
        // Parse incoming requests data
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

    /**
     * Create and return Router.
     *
     */
    private setRoutes(): void {
        this.app.use('/', new IndexRouter().router);
        this.app.use('/catalog', new CatalogRouter().router);
    }

    /**
     * Create Error handler
     *
     */
    private setErrorHandler(): void {

        // error handler
        this.app.use(function (err, req, res, next) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};

            // render the error page
            res.status(err.status || 500);
            res.render('error');
        });
    }

    /**
     * Create Error handler
     *
     */
    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    /**
     * Connect DB
     *
     */
    private connectToTheDatabase() {
        const mongooseConn = new MongooseConn();
        mongooseConn.initConn();
    }
}