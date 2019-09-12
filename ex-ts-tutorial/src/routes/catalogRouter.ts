import { Request, Response, Router, NextFunction } from "express";
import { BaseRouter } from "./baseRouter"
import { AuthorController } from "../controllers/authorController"
import { GenreController } from "../controllers/genreController"
import { BookinstanceController } from "../controllers/bookinstanceController"
import { BookController } from "../controllers/bookController"


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

    // Require our controllers.
    const authorController = new AuthorController();
    const genreController = new GenreController();
    const bookinstanceController = new BookinstanceController();
    const bookController = new BookController();

    /// BOOK ROUTES ///
    // GET catalog home page.
    this.router.get('/', bookController.index);

    // GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
    this.router.get('/book/create', bookController.bookCreateGet);

    // POST request for creating Book.
    this.router.post('/book/create', bookController.bookCreateConvert, bookController.bookCreateCheck, bookController.bookCreatePost);

    // GET request to delete Book.
    this.router.get('/book/:id/delete', bookController.bookDeleteGet);

    // POST request to delete Book.
    this.router.post('/book/:id/delete', bookController.bookDeletePost);

    // GET request to update Book.
    this.router.get('/book/:id/update', bookController.bookUpdateGet);

    // POST request to update Book.
    this.router.post('/book/:id/update', bookController.bookUpdatePost);

    // GET request for one Book.
    this.router.get('/book/:id', bookController.bookDetail);

    // GET request for list of all Book.
    this.router.get('/books', bookController.bookList);

    /// AUTHOR ROUTES ///
    // GET catalog home page.
    this.router.get('/authors', authorController.getAuthorList);

    // GET request for creating Author. NOTE This must come before route for id (i.e. display author).
    this.router.get('/author/create', authorController.authorCreateGet);
    
    // POST request for creating Author.(validate check with Way 1 and Way 2)
    // this.router.post('/author/create', authorController.authorCreateCheck, authorController.authorCreatePost);
    this.router.post('/author/create', authorController.authorCreatePost_way_2);

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

    /// BOOKINSTANCE ROUTES ///
    // GET request for creating a BookInstance. NOTE This must come before route that displays BookInstance (uses id).
    this.router.get('/bookinstance/create', bookinstanceController.bookinstanceCreateGet);

    // POST request for creating BookInstance.
    this.router.post('/bookinstance/create', bookinstanceController.bookinstanceCreateCheck, bookinstanceController.bookinstanceCreatePost);

    // GET request to delete BookInstance.
    this.router.get('/bookinstance/:id/delete', bookinstanceController.bookinstanceDeleteGet);

    // POST request to delete BookInstance.
    this.router.post('/bookinstance/:id/delete', bookinstanceController.bookinstanceDeletePost);

    // GET request to update BookInstance.
    this.router.get('/bookinstance/:id/update', bookinstanceController.bookinstanceUpdateGet);

    // POST request to update BookInstance.
    this.router.post('/bookinstance/:id/update', bookinstanceController.bookinstanceCreateCheck, bookinstanceController.bookinstanceUpdatePost);

    // GET request for one BookInstance.
    this.router.get('/bookinstance/:id', bookinstanceController.bookinstanceDetail);

    // GET request for list of all BookInstance.
    this.router.get('/bookinstances', bookinstanceController.bookinstanceList);
  }
}