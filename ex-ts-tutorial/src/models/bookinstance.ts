import { Schema, Document, Model, model } from 'mongoose';
import * as moment from 'moment';
import { IBook } from './book';

export interface IBookInstance extends Document {
    book: IBook['_id'];
    imprint: string;
    status: string;
    due_back: Date;
    url: string;
}

var BookInstanceSchema = new Schema({
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true }, // Reference to the associated book.
    imprint: { type: String, required: true },
    status: { type: String, required: true, enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'], default: 'Maintenance' },
    due_back: { type: Date, default: Date.now },
});

// Virtual for this bookinstance object's URL.
BookInstanceSchema
    .virtual('url')
    .get(function () {
        return '/catalog/bookinstance/' + this._id;
    });

BookInstanceSchema
    .virtual('due_back_formatted')
    .get(function () {
        return moment(this.due_back).format('MMMM Do, YYYY');
    });

BookInstanceSchema
    .virtual('due_back_yyyy_mm_dd')
    .get(function () {
        return moment(this.due_back).format('YYYY-MM-DD');
    });

export const BookInstance: Model<IBookInstance> = model<IBookInstance>('BookInstance', BookInstanceSchema);