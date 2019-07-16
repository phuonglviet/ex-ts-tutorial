import { NextFunction, Request, Response, Router } from "express";

export abstract class BaseRouter {

    // public router = Router();
    public path = '/';

    /**
     * Constructor
     *
     * @constructor
     */
    constructor() {
        //this.intializeRoutes();
    }

    /**
   * Create routes.
   *
   */
    // public abstract create(): Router;

    /**
   * Create routes.
   *
   */
    public abstract intializeRoutes(): void;
}