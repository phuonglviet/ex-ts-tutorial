import { Request, Response, Router, NextFunction } from "express";
import { BaseRouter } from "./baseRouter"
import { AuthorController} from "../controllers/authorController"

export class CatalogRouter extends BaseRouter {

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
    const authorController = new AuthorController();
    // GET catalog home page.
    this.router.get(this.rootPath, authorController.getAuthorList);
  }
}