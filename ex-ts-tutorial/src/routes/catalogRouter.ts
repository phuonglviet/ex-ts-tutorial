import { Request, Response, Router, NextFunction } from "express";
import { BaseRouter } from "./baseRouter"
import { AuthorController } from "../controllers/authorController"
import { GenreController } from "../controllers/genreController"


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

    /// AUTHOR ROUTES ///
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

    // GET request to update Author.
    this.router.get('/author/:id/update', authorController.authorUpdateGet);

    // POST request to update Author.
    this.router.post('/author/:id/update', authorController.authorCreateCheck, authorController.authorUpdatePost);


    /// GENRE ROUTES ///
    const genreController = new GenreController();
    // GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
    this.router.get('/genre/create', genreController.genreCreateGet);

    // POST request for creating Genre.
    this.router.post('/genre/create', genreController.genreCreateCheck, genreController.genreCreatePost);

    // GET request to delete Genre.
    this.router.get('/genre/:id/delete', genreController.genreDeleteGet);

    // POST request to delete Genre.
    this.router.post('/genre/:id/delete', genreController.genreDeletePost);

    // GET request to update Genre.
    this.router.get('/genre/:id/update', genreController.genreUpdateGet);

    // POST request to update Genre.
    this.router.post('/genre/:id/update', genreController.genreCreateCheck, genreController.genreUpdatePost);

    // GET request for one Genre.
    this.router.get('/genre/:id', genreController.getGenreDetail);

    // GET request for list of all Genre.
    this.router.get('/genres', genreController.getGenreList);

  }
}