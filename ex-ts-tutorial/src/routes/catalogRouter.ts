import { Request, Response, Router, NextFunction } from "express";
import { BaseRouter } from "./baseRouter"
import { AuthorController } from "../controllers/authorController"

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

    // GET request for creating Author. NOTE This must come before route for id (i.e. display author).
    this.router.get('/author/create', authorController.authorCreateGet);

    // POST request for creating Author.
    this.router.post('/author/create', authorController.authorCreateCheck, authorController.authorCreatePost);

    // GET request for one Author.
    this.router.get('/author/:id', authorController.getAuthorDetail);

    // GET request to delete Author.
    this.router.get('/author/:id/delete', authorController.authorDeleteGet);

    // POST request to delete Author
    this.router.post('/author/:id/delete', authorController.authorDeletePost);

  }
}