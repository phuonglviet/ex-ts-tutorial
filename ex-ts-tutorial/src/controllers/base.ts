import { NextFunction, Request, Response, Router } from "express";

/**
 * BaseController
 *
 * @class BaseController
 */
export abstract class BaseController {
  protected title: string;
  private scripts: string[];

  /**
   * Constructor
   *
   * @constructor
   */
  constructor() {
    this.title = "TODO";
    this.scripts = [];
  }

  /**
   * Create routes.
   *
   */
  public abstract create(): Router;

  /**
   * Add a JS external file to the request.
   *
   * @param src {string} The src to the external JS file.
   */
  protected addScript(src: string): BaseController {
    this.scripts.push(src);
    return this;
  }

  /**
   * Render page.
   *
   * @param req {Request} Request object.
   * @param res {Response} Response object.
   * @param view {String} View to render.
   * @param options {Object} Additional options to append to the view's local scope.
   */
  protected render(req: Request, res: Response, view: string, options?: object): void {
    res.locals.BASE_URL = "/";
    res.locals.scripts = this.scripts;
    res.locals.title = this.title;
    res.render(view, options);
  }
}
