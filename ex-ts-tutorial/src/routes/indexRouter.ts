import { Request, Response, Router, NextFunction } from "express";
import { BaseRouter } from "./baseRouter"

export class IndexRouter extends BaseRouter {

  /**
 * Constructor
 *
 * @constructor
 */
  constructor() {
    super();
  }

  /**
   * Create routes.
   *
   * @override
   */
  public intializeRoutes() {
    /* GET home page. */
    this.router.get(this.rootPath, (req: Request, res: Response, next: NextFunction) => {
      // res.render("index", { title: "Express" });
      res.redirect('/catalog');
    });
  }
}