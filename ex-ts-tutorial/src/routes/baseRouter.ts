import { NextFunction, Request, Response, Router } from "express";

export abstract class BaseRouter {

    public router = Router();
    public rootPath = '/';

    /**
     * Constructor
     *
     * @constructor
     */
    constructor() {
        this.intializeRoutes();
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