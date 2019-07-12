import * as createError from 'http-errors';
import * as express from "express";
import * as path from "path";
import * as cookieParser from 'cookie-parser';
import * as logger from 'morgan';

import { MongooseConn } from "./mongooseConn";

import { IndexRouter } from "./routes/indexRouter";

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
        this.app = express();
        this.setConfig();
        this.setRoutes();
        this.setErrorHandler();
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
        this.app.use(express.static(path.join(__dirname, 'public')));
    }

    /**
     * Create and return Router.
     *
     */
    private setRoutes(): void {
        this.app.use('/', new IndexRouter().create());
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

    private connectToTheDatabase() {
        const mongooseConn = new MongooseConn();
        mongooseConn.initConn();
    }
}