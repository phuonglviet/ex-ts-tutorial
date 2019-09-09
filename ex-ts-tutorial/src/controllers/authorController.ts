import { Request, Response, Router, NextFunction } from "express";
import * as async from "async";
import NotFoundException from "../exceptions/notFoundException"
import { Author } from "../models/author";
import { Book, IBook } from '../models/book';
import { Genre } from '../models/genre';
import { DateUtil } from "../util/dateUtil";
import { domainToASCII } from "url";
const { check, body, validationResult } = require('express-validator');


export class AuthorController {

    /**
     * Constructor
     *
     * @constructor
     */
    constructor() {
    }

    /*
    * Display list of all Authors.
    */
    public getAuthorList(req: Request, res: Response, next: NextFunction): void {

        Author.find()
            .sort([['family_name', 'ascending']])
            .exec(function (err, listAuthors) {
                if (err) { return next(err); }
                // Successful, so render.
                res.render('author_list', { title: 'Author List', authorList: listAuthors });
            })
    }

    /*
    * Display detail page for a specific Author.
    */
    public getAuthorDetail(req: Request, res: Response, next: NextFunction): void {
        async.parallel({
            author: function (callback) {
                Author.findById(req.params.id)
                    .exec(callback)
            },
            authors_books: function (callback) {
                Book.find({ 'author': req.params.id }, 'title summary')
                    .exec(callback)
            },
        }, function (err, results) {
            if (err) { return next(err); } // Error in API usage.
            if (results.author == null) { // No results.
                const id = req.params.id;
                var error = new NotFoundException('Author not found with id :' + id);
                return next(error);
            }
            // Successful, so render.
            res.render('author_detail', { title: 'Author Detail', author: results.author, author_books: results.authors_books });
        }
        );
    }

    /*
    * Display Author create form on GET.
    */
    public authorCreateGet(req: Request, res: Response, next: NextFunction): void {
        res.render('author_form', { title: 'Create Author' });
    }

    /*
    * Handle Author create on POST Validate.
    */
    public authorCreateCheck = [
        // Validate fields.
        check('first_name').isLength({ min: 10 }).trim().escape().withMessage('First name must be specified.')
            .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
        check('family_name').isLength({ min: 10 }).trim().escape().withMessage('Family name must be specified.')
            .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
        check('date_of_birth', 'date of birth is required').not().isEmpty(),
        check('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601().toDate(),
        check('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601().toDate()
    ];

    /*
     * Handle Author create on POST.
     */
    public authorCreatePost(req: Request, res: Response, next: NextFunction): void {

        // Process request after validation and sanitization.
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create Author object with escaped and trimmed data
        var author = new Author(
            {
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death,
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('author_form', { title: 'Create Author', author: author, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Save author.
            author.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new author record.
                res.redirect(author.url);
            });
        }
    }

    /*
     * Display Author delete form on GET.
     */
    public authorDeleteGet(req: Request, res: Response, next: NextFunction): void {
        // async.parallel({
        //     author: function (callback) {
        //         Author.findById(req.params.id).exec(callback)
        //     },
        //     authors_books: function (callback) {
        //         Book.find({ 'author': req.params.id }).exec(callback)
        //     },
        // }, function (err, results) {
        //     if (err) { return next(err); }
        //     if (results.author == null) { // No results.
        //         res.redirect('/catalog/authors');
        //     }
        //     // Successful, so render.
        //     res.render('author_delete', { title: 'Delete Author', author: results.author, author_books: results.authors_books });
        // });

        // async function findData() {
        //     try {
        //         let author = Author.findById(req.params.id);
        //         let books = Book.find({ 'author': req.params.id });
        //         if (author == null) { // No results.
        //             res.redirect('/catalog/authors');
        //         }

        //         res.render('author_delete', { title: 'Delete Author', author: author, author_books: books });
        //     } catch (err) {
        //         return next(err);
        //     }
        // }

        // findData();

        // var authorQuery = Author.findById(req.params.id).exec(function (err, author) {
        //     if (err) { return next(err); }
        //     if (author == null) { // No results.
        //         res.redirect('/catalog/authors');
        //     }
        // });

        // authorQuery.then(function (author) {
        //     var bookQuery = Book.find({ 'author': req.params.id }).exec(function (err, books) {
        //         if (err) { return next(err); }
        //         res.render('author_delete', { title: 'Delete Author', author: author, author_books: books });
        //     });
        // });



       //     authors_books: function (callback) {
        //         Book.find({ 'author': req.params.id }).exec(callback)
        //     res.render('author_delete', { title: 'Delete Author', author: results.author, author_books: results.authors_books });

        var authorQuery = Author.findById(req.params.id);
        var promise = authorQuery.exec();
        promise.then(function (author) {
            // Book.find({ 'author': req.params.id }).exec(function (err, books) {
            //     if (err) { return next(err); }
            //     res.render('author_delete', { title: 'Delete Author', author: author, author_books: books });
            // });
            var b1 = Book.find({ 'author': req.params.id });
            res.render('author_delete', { title: 'Delete Author', author: author, author_books: b1 });
            
        });

        promise.catch(err => {
            //handle possible errors
            return next(err);
        });


    }

    /*
    * Handle Author delete on POST.
    */
    public authorDeletePost(req: Request, res: Response, next: NextFunction): void {

        // async.parallel({
        //     author: function (callback) {
        //         Author.findById(req.body.authorid).exec(callback)
        //     },
        //     authors_books: function (callback) {
        //         Book.find({ 'author': req.body.authorid }).exec(callback)
        //     },
        // }, function (err: Error, results) {
        //     if (err) { return next(err); }
        //     // Success.
        //     if (results.authors_books.length > 0) {
        //         // Author has books. Render in same way as for GET route.
        //         res.render('author_delete', { title: 'Delete Author', author: results.author, author_books: results.authors_books });
        //         return;
        //     }
        //     else {
        //         // Author has no books. Delete object and redirect to the list of authors.
        //         Author.findByIdAndRemove(req.body.authorid, function deleteAuthor(err) {
        //             if (err) { return next(err); }
        //             // Success - go to author list.
        //             res.redirect('/catalog/authors')
        //         })

        //     }
        // });

        var authorQuery = Author.findById(req.body.authorid).exec(function (err, author) {
            if (err) { return next(err); }
        });

        authorQuery.then(function (author) {
            var bookQuery = Book.find({ 'author': req.body.authorid }).exec(function (err, books) {
                if (err) { return next(err); }
                if (books.length > 0) {
                    // Author has books. Render in same way as for GET route.
                    res.render('author_delete', { title: 'Delete Author', author: author, author_books: books });
                    return;
                }
                else {
                    // Author has no books. Delete object and redirect to the list of authors.
                    Author.findByIdAndRemove(req.body.authorid, function deleteAuthor(err) {
                        if (err) { return next(err); }
                        // Success - go to author list.
                        res.redirect('/catalog/authors')
                    })
                }
            });
        });



        // async function findData() {
        //     try {

        //         Book.find({ 'author': req.body.authorid }).exec(function (err, docs) {
        //             var length = docs.length;

        //             console.log(length);
        //         });

        //         let author = Author.findById(req.params.id);
        //         let books = Book.find({ 'author': req.body.authorid });
        //         if (author == null) { // No results.
        //             res.redirect('/catalog/authors');
        //         }

        //         // Success.
        //     //if (books.length > 0) {
        //     //     // Author has books. Render in same way as for GET route.
        //     //     res.render('author_delete', { title: 'Delete Author', author: results.author, author_books: results.authors_books });
        //     //     return;
        //     //}

        //     } catch (err) {
        //         return next(err);
        //     }
        // }

        // findData();


    }
}