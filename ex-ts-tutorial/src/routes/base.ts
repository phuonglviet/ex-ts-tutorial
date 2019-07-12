import { NextFunction, Request, Response, Router } from "express";

export abstract class BaseRouter {

    /**
     * Constructor
     *
     * @constructor
     */
    constructor() {
    }

    /**
   * Create routes.
   *
   */
    public abstract create(): Router;
}