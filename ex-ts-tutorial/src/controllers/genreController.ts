import { Request, Response, Router, NextFunction } from "express";
import { Book, IBook } from '../models/book';
import { Genre } from '../models/genre';
const { check, body, validationResult } = require('express-validator');

export class GenreController {

    /**
     * Constructor
     *
     * @constructor
     */
    constructor() {
    }

    /*
    * Display list of all Genre.
    */
    public getGenreList(req: Request, res: Response, next: NextFunction): void {

        Genre.find()
            .sort([['name', 'ascending']])
            .exec(function (err, list_genres) {
                if (err) { return next(err); }
                // Successful, so render.
                res.render('genre_list', { title: 'Genre List', list_genres: list_genres });
            });
    }

    /*
    * Display detail page for a specific Author.
    */
    public getGenreDetail(req: Request, res: Response, next: NextFunction): void {

        let genreQuery = Genre.findById(req.params.id).exec();
        let bookQuery = Book.find({ 'genre': req.params.id }).exec();
        Promise.all([
            genreQuery,
            bookQuery
        ])
            .then(([genre, books]) => {
                if (genre == null) { // No results.
                    var err = new Error('Genre not found');
                    // err.status = 404;
                    return next(err);
                }
                // Successful, so render.
                res.render('genre_detail', { title: 'Genre Detail', genre: genre, genre_books: books });
            })
            .catch(err => {
                //handle possible errors
                return next(err);
            });
    }

    /*
    * Display Genre create form on GET.
    */
    public genreCreateGet(req: Request, res: Response, next: NextFunction): void {
        res.render('genre_form', { title: 'Create Genre' });
    }

    /*
    * Handle Genre create on POST Validate.
    */
    public genreCreateCheck = [
        // Validate fields.
        // Validate that the name field is not empty.
        check('name').trim().escape().isLength({ min: 1 }).withMessage('Genre name required.'),
    ];

    /*
     * Handle Genre create on POST.
     */
    public genreCreatePost(req: Request, res: Response, next: NextFunction): void {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data.
        var genre = new Genre(
            { name: req.body.name }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.
            // Check if Genre with same name already exists.
            Genre.findOne({ 'name': req.body.name })
                .exec(function (err, found_genre) {
                    if (err) { return next(err); }

                    if (found_genre) {
                        // Genre exists, redirect to its detail page.
                        res.redirect(found_genre.url);
                    }
                    else {

                        genre.save(function (err) {
                            if (err) { return next(err); }
                            // Genre saved. Redirect to genre detail page.
                            res.redirect(genre.url);
                        });
                    }
                });
            let genreQuery = Genre.findById(req.params.id).exec();
            let bookQuery = Book.find({ 'genre': req.params.id }).exec();
            Promise.all([
                genreQuery,
                bookQuery
            ])
                .then(([genre, books]) => {
                    if (genre == null) { // No results.
                        var err = new Error('Genre not found');
                        // err.status = 404;
                        return next(err);
                    }
                    // Successful, so render.
                    res.render('genre_detail', { title: 'Genre Detail', genre: genre, genre_books: books });
                })
                .catch(err => {
                    //handle possible errors
                    return next(err);
                });
        }
    }

    /*
     * Display Genre delete form on GET.
     */
    public genreDeleteGet(req: Request, res: Response, next: NextFunction): void {
        
        let genreQuery = Genre.findById(req.params.id).exec();
        let bookQuery = Book.find({ 'genre': req.params.id }).exec();
        Promise.all([
            genreQuery,
            bookQuery
        ])
            .then(([genre, books]) => {
                if (genre == null) { // No results.
                    res.redirect('/catalog/genres');
                }
                // Successful, so render.
                res.render('genre_delete', { title: 'Delete Genre', genre: genre, genre_books: books });
            })
            .catch(err => {
                //handle possible errors
                return next(err);
            });
    }

    /*
     * Handle Genre delete on POST.
     */
    public genreDeletePost(req: Request, res: Response, next: NextFunction): void {
        Genre.findById(req.params.id).exec()
            .then(function (genre) {
                if (genre == null) { // No results.
                    res.redirect('/catalog/genres');
                }

                Book.find({ 'genre': req.params.id }).exec()
                    .then(function (books) {
                        if (books.length > 0) {
                            // Genre has books. Render in same way as for GET route.
                            res.render('genre_delete', { title: 'Delete Genre', genre: genre, genre_books: books });
                            return;
                        }
                        else {
                            // Genre has no books. Delete object and redirect to the list of genres.
                            Genre.findByIdAndRemove(req.body.id, function deleteGenre(err) {
                                if (err) { return next(err); }
                                // Success - go to genres list.
                                res.redirect('/catalog/genres');
                            });
                        }
                    });
            })
            .catch(err => {
                //handle possible errors
                return next(err);
            });
    }

    /*
     * Display Genre update form on GET.
     */
    public genreUpdateGet(req: Request, res: Response, next: NextFunction): void {

        Genre.findById(req.params.id, function (err, genre) {
            if (err) { return next(err); }
            if (genre == null) { // No results.
                var error = new Error('Genre not found');
                // error.status = 404;
                return next(error);
            }
            // Success.
            res.render('genre_form', { title: 'Update Genre', genre: genre });
        });
    }

    /*
     * Handle Genre update on POST.
     */
    public genreUpdatePost(req: Request, res: Response, next: NextFunction): void {

        // Extract the validation errors from a request .
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data (and the old id!)
        var genre = new Genre(
            {
                name: req.body.name,
                _id: req.params.id
            }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('genre_form', { title: 'Update Genre', genre: genre, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Genre.findByIdAndUpdate(req.params.id, genre, {}, function (err, thegenre) {
                if (err) { return next(err); }
                // Successful - redirect to genre detail page.
                res.redirect(thegenre.url);
            });
        }
    }

}