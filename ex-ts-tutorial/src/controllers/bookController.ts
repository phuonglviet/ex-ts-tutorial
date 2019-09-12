import { Request, Response, Router, NextFunction } from "express";
import { Book, IBook } from '../models/book';
import { Genre } from '../models/genre';
import { Author } from '../models/author';
import { BookInstance } from '../models/bookinstance';
const { check, body, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');

export class BookController {

    /**
     * Constructor
     *
     * @constructor
     */
    constructor() {
    }

    /*
    * Display index page.
    */
    public index(req: Request, res: Response, next: NextFunction): void {

        let bookCountQuery = Book.countDocuments().exec();
        let bookInstanceCountQuery = BookInstance.countDocuments().exec();
        let bookInstanceAvailableCountQuery = BookInstance.countDocuments({ status: 'Available' }).exec();
        let authorCountQuery = Author.countDocuments().exec();
        let genreCountQuery = Genre.countDocuments().exec();

        Promise.all([
            bookCountQuery,
            bookInstanceCountQuery,
            bookInstanceAvailableCountQuery,
            authorCountQuery,
            genreCountQuery
        ])
            .then(([bookCount, bookInstanceCount, bookInstanceAvailableCount, authorCount, genreCount]) => {
                // Successful, so render.
                res.render('index', {
                    title: 'Local Library Home',
                    data: {
                        book_count: bookCount,
                        book_instance_count: bookInstanceCount,
                        book_instance_available_count: bookInstanceAvailableCount,
                        author_count: authorCount,
                        genre_count: genreCount
                    }
                });
            })
            .catch(err => {
                //handle possible errors
                return next(err);
            });
    }

    /*
    * Display list of all books.
    */
    public bookList(req: Request, res: Response, next: NextFunction): void {

        Book.find({}, 'title author ')
            .populate('author')
            .exec(function (err, list_books) {
                if (err) { return next(err); }
                // Successful, so render
                res.render('book_list', { title: 'Book List', book_list: list_books });
            });

    }

    /*
     * Display detail page for a specific book.
     */
    public bookDetail(req: Request, res: Response, next: NextFunction): void {

        let bookQuery = Book.findById(req.params.id).populate('author').populate('genre').exec();
        let bookInstanceQuery = BookInstance.find({ 'book': req.params.id }).exec();

        Promise.all([
            bookQuery,
            bookInstanceQuery
        ])
            .then(([book, book_instance]) => {
                // Successful, so render.
                res.render('book_detail', { title: 'Title', book: book, book_instances: book_instance });
            })
            .catch(err => {
                //handle possible errors
                var error = new Error('Book not found');
                return next(error);
            });
    }

    /*
     * Display book create form on GET.
     */
    public bookCreateGet(req: Request, res: Response, next: NextFunction): void {

        // Get all authors and genres, which we can use for adding to our book.
        let authorsQuery = Author.find().exec();
        let genresQuery = Genre.find().exec();

        Promise.all([
            authorsQuery,
            genresQuery
        ])
            .then(([authors, genres]) => {
                // Successful, so render.
                res.render('book_form', { title: 'Create Book', authors: authors, genres: genres });
            })
            .catch(err => {
                //handle possible errors
                return next(err);
            });
    }

    /*
    * Handle book create on POST, Convert the genre to an array.
    */
    public bookCreateConvert(req: Request, res: Response, next: NextFunction): void {

        // Convert the genre to an array.
        if (!(req.body.genre instanceof Array)) {
            if (typeof req.body.genre === 'undefined') {
                req.body.genre = [];
            }
            else {
                req.body.genre = new Array(req.body.genre);
            }
        }

        next();
    }

    /*
    * Handle book create on POST Validate.
    */
    public bookCreateCheck = [
        // Validate fields.
        check('title').trim().escape().isLength({ min: 1 }).withMessage('Title must not be empty.'),
        check('author').trim().escape().isLength({ min: 1 }).withMessage('Author must not be empty.'),
        check('summary').trim().escape().isLength({ min: 1 }).withMessage('Summary must not be empty.'),
        check('isbn').trim().escape().isLength({ min: 1 }).withMessage('ISBN must not be empty.'),
        // Sanitize fields.
        //sanitizeBody('*').escape(),
        sanitizeBody('genre.*').escape()
    ];

    /*
     * Handle book create on POST.
     */
    public bookCreatePost(req: Request, res: Response, next: NextFunction): void {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped and trimmed data.
        var book = new Book(
            {
                title: req.body.title,
                author: req.body.author,
                summary: req.body.summary,
                isbn: req.body.isbn,
                genre: req.body.genre
            });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            let authorsQuery = Author.find().exec();
            let genresQuery = Genre.find().exec();

            Promise.all([
                authorsQuery,
                genresQuery
            ])
                .then(([authors, genres]) => {
                    // Successful, so render.
                    // Mark our selected genres as checked.
                    for (let i = 0; i < genres.length; i++) {
                        if (book.genre.indexOf(genres[i]._id) > -1) {
                            genres[i].checked = 'true';
                        }
                    }
                    res.render('book_form', { title: 'Create Book', authors: authors, genres: genres, book: book, errors: errors.array() });
                })
                .catch(err => {
                    //handle possible errors
                    return next(err);
                });
            return;
        }
        else {
            // Data from form is valid. Save book.
            book.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new book record.
                res.redirect(book.url);
            });
        }
    }

    /*
     * Display book delete form on GET.
     */
    public bookDeleteGet(req: Request, res: Response, next: NextFunction): void {

        let bookQuery = Book.findById(req.params.id).populate('author').populate('genre').exec();
        let bookInstanceQuery = BookInstance.find({ 'book': req.params.id }).exec();

        Promise.all([
            bookQuery,
            bookInstanceQuery
        ])
            .then(([book, book_bookinstances]) => {
                if (book == null) { // No results.
                    res.redirect('/catalog/books');
                }

                // Successful, so render.
                res.render('book_delete', { title: 'Delete Book', book: book, book_instances: book_bookinstances });
            })
            .catch(err => {
                //handle possible errors
                return next(err);
            });
    }

    /*
     * Handle book delete on POST.
     */
    public bookDeletePost(req: Request, res: Response, next: NextFunction): void {

        // Assume the post has valid id (ie no validation/sanitization).
        let bookQuery = Book.findById(req.body.id).populate('author').populate('genre').exec();
        let bookInstanceQuery = BookInstance.find({ 'book': req.body.id }).exec();

        Promise.all([
            bookQuery,
            bookInstanceQuery
        ])
            .then(([book, book_bookinstances]) => {
                if (book == null) { // No results.
                    res.redirect('/catalog/books');
                }

                // Success
                if (book_bookinstances.length > 0) {
                    // Book has book_instances. Render in same way as for GET route.
                    res.render('book_delete', { title: 'Delete Book', book: book, book_instances: book_bookinstances });
                    return;
                }
                else {
                    // Book has no BookInstance objects. Delete object and redirect to the list of books.
                    Book.findByIdAndRemove(req.body.id, function deleteBook(err) {
                        if (err) { return next(err); }
                        // Success - got to books list.
                        res.redirect('/catalog/books');
                    });

                }
            })
            .catch(err => {
                //handle possible errors
                return next(err);
            });
    }

    /*
     * Display book update form on GET.
     */
    public bookUpdateGet(req: Request, res: Response, next: NextFunction): void {

        let bookQuery = Book.findById(req.params.id).populate('author').populate('genre').exec();
        let authorsQuery = Author.find().exec();
        let genresQuery = Genre.find().exec();

        Promise.all([
            bookQuery,
            authorsQuery,
            genresQuery
        ])
            .then(([book, authors, genres]) => {
                if (book == null) { // No results.
                    var err = new Error('Book not found');
                    //err.status = 404;
                    return next(err);
                }
                // Success.
                // Mark our selected genres as checked.
                for (var all_g_iter = 0; all_g_iter < genres.length; all_g_iter++) {
                    for (var book_g_iter = 0; book_g_iter < book.genre.length; book_g_iter++) {
                        if (genres[all_g_iter]._id.toString() == book.genre[book_g_iter]._id.toString()) {
                            genres[all_g_iter].checked = 'true';
                        }
                    }
                }
                res.render('book_form', { title: 'Update Book', authors: authors, genres: genres, book: book });
            })
            .catch(err => {
                //handle possible errors
                return next(err);
            });
    }

    /*
     * Handle book update on POST.
     */
    public bookUpdatePost(req: Request, res: Response, next: NextFunction): void {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped/trimmed data and old id.
        var book = new Book(
            {
                title: req.body.title,
                author: req.body.author,
                summary: req.body.summary,
                isbn: req.body.isbn,
                genre: (typeof req.body.genre === 'undefined') ? [] : req.body.genre,
                _id: req.params.id // This is required, or a new ID will be assigned!
            });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form
            let authorsQuery = Author.find().exec();
            let genresQuery = Genre.find().exec();

            Promise.all([
                authorsQuery,
                genresQuery
            ])
                .then(([authors, genres]) => {
                    // Mark our selected genres as checked.
                    for (let i = 0; i < genres.length; i++) {
                        if (book.genre.indexOf(genres[i]._id) > -1) {
                            genres[i].checked = 'true';
                        }
                    }
                    res.render('book_form', { title: 'Update Book', authors: authors, genres: genres, book: book, errors: errors.array() });
                })
                .catch(err => {
                    //handle possible errors
                    return next(err);
                });

            return;
        }
        else {
            // Data from form is valid. Update the record.
            Book.findByIdAndUpdate(req.params.id, book, {}, function (err, thebook) {
                if (err) { return next(err); }
                // Successful - redirect to book detail page.
                res.redirect(thebook.url);
            });
        }
    }
}