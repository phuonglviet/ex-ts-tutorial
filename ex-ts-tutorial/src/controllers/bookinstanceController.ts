import { Request, Response, Router, NextFunction } from "express";
import { Book, IBook } from '../models/book';
import { Genre } from '../models/genre';
import { BookInstance } from '../models/bookinstance';
const { check, body, validationResult } = require('express-validator');

export class BookinstanceController {

    /**
     * Constructor
     *
     * @constructor
     */
    constructor() {
    }

    /*
    * Display list of all BookInstances.
    */
    public bookinstanceList(req: Request, res: Response, next: NextFunction): void {

        BookInstance.find()
            .populate('book')
            .exec(function (err, list_bookinstances) {
                if (err) { return next(err); }
                // Successful, so render.
                res.render('bookinstance_list', { title: 'Book Instance List', bookinstance_list: list_bookinstances });
            })
    }

    /*
    * Display detail page for a specific BookInstance.
    */
    public bookinstanceDetail(req: Request, res: Response, next: NextFunction): void {

        BookInstance.findById(req.params.id)
            .populate('book')
            .exec(function (err, bookinstance) {
                if (err) { return next(err); }
                if (bookinstance == null) { // No results.
                    var error = new Error('Book copy not found');
                    // error.status = 404;
                    return next(err);
                }
                // Successful, so render.
                res.render('bookinstance_detail', { title: 'Book:', bookinstance: bookinstance });
            })

    }

    /*
    * Display BookInstance create form on GET.
    */
    public bookinstanceCreateGet(req: Request, res: Response, next: NextFunction): void {

        Book.find({}, 'title')
            .exec(function (err, books) {
                if (err) { return next(err); }
                // Successful, so render.
                res.render('bookinstance_form', { title: 'Create BookInstance', book_list: books });
            });
    }

    /*
    * Handle BookInstance create on POST Validate.
    */
    public bookinstanceCreateCheck = [

        // Validate fields.
        check('book').trim().escape().isLength({ min: 1 }).withMessage('Book must be specified.'),
        check('imprint').trim().escape().isLength({ min: 1 }).withMessage('Imprint must be specified.'),
        check('status').trim().escape(),
        check('due_back', 'Invalid date.').optional({ checkFalsy: true }).isISO8601().toDate()
    ];

    /*
    * Handle BookInstance create on POST.
    */
    public bookinstanceCreatePost(req: Request, res: Response, next: NextFunction): void {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a BookInstance object with escaped and trimmed data.
        var bookinstance = new BookInstance(
            {
                book: req.body.book,
                imprint: req.body.imprint,
                status: req.body.status,
                due_back: req.body.due_back
            });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages.
            Book.find({}, 'title')
                .exec(function (err, books) {
                    if (err) { return next(err); }
                    // Successful, so render.
                    res.render('bookinstance_form', { title: 'Create BookInstance', book_list: books, selected_book: bookinstance.book._id, errors: errors.array(), bookinstance: bookinstance });
                });
            return;
        }
        else {
            // Data from form is valid
            bookinstance.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new record.
                res.redirect(bookinstance.url);
            });
        }
    }

    /*
    * Display BookInstance delete form on GET.
    */
    public bookinstanceDeleteGet(req: Request, res: Response, next: NextFunction): void {

        BookInstance.findById(req.params.id)
            .populate('book')
            .exec(function (err, bookinstance) {
                if (err) { return next(err); }
                if (bookinstance == null) { // No results.
                    res.redirect('/catalog/bookinstances');
                }
                // Successful, so render.
                res.render('bookinstance_delete', { title: 'Delete BookInstance', bookinstance: bookinstance });
            })
    }

    /*
    * Handle BookInstance delete on POST.
    */
    public bookinstanceDeletePost(req: Request, res: Response, next: NextFunction): void {

        // Assume valid BookInstance id in field.
        BookInstance.findByIdAndRemove(req.body.id, function deleteBookInstance(err) {
            if (err) { return next(err); }
            // Success, so redirect to list of BookInstance items.
            res.redirect('/catalog/bookinstances');
        });
    }

    /*
    * Display BookInstance update form on GET.
    */
    public bookinstanceUpdateGet(req: Request, res: Response, next: NextFunction): void {

        let bookinstanceQuery = BookInstance.findById(req.params.id).populate('book').exec();
        let bookQuery = Book.find().exec();
        Promise.all([
            bookinstanceQuery,
            bookQuery
        ])
            .then(([bookinstance, books]) => {
                if (bookinstance == null) { // No results.
                    var err = new Error('Book copy not found');
                    //err.status = 404;
                    return next(err);
                }
                // Success.
                res.render('bookinstance_form', { title: 'Update  BookInstance', book_list: books, selected_book: bookinstance.book._id, bookinstance: bookinstance });
            })
            .catch(err => {
                //handle possible errors
                return next(err);
            });
    }

    /*
    * Handle BookInstance update on POST.
    */
    public bookinstanceUpdatePost(req: Request, res: Response, next: NextFunction): void {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a BookInstance object with escaped/trimmed data and current id.
        var bookinstance = new BookInstance(
            {
                book: req.body.book,
                imprint: req.body.imprint,
                status: req.body.status,
                due_back: req.body.due_back,
                _id: req.params.id
            });

        if (!errors.isEmpty()) {
            // There are errors so render the form again, passing sanitized values and errors.
            Book.find({}, 'title')
                .exec(function (err, books) {
                    if (err) { return next(err); }
                    // Successful, so render.
                    res.render('bookinstance_form', { title: 'Update BookInstance', book_list: books, selected_book: bookinstance.book._id, errors: errors.array(), bookinstance: bookinstance });
                });
            return;
        }
        else {
            // Data from form is valid.
            BookInstance.findByIdAndUpdate(req.params.id, bookinstance, {}, function (err, thebookinstance) {
                if (err) { return next(err); }
                // Successful - redirect to detail page.
                res.redirect(thebookinstance.url);
            });
        }
    }


}
