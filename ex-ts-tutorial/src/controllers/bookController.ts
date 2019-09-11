import { Request, Response, Router, NextFunction } from "express";
import { Book, IBook } from '../models/book';
import { Genre } from '../models/genre';
const { check, body, validationResult } = require('express-validator');

export class BookController {

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
    public index(req: Request, res: Response, next: NextFunction): void {

        // Genre.find()
        //     .sort([['name', 'ascending']])
        //     .exec(function (err, list_genres) {
        //         if (err) { return next(err); }
        //         // Successful, so render.
        //         res.render('genre_list', { title: 'Genre List', list_genres: list_genres });
        //     });
    }
}