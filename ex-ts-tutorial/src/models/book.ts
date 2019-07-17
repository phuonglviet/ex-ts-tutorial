import { Schema, Document, Model, model } from 'mongoose';

export interface IBook extends Document {
    title: String;
    family_name: String;
    summary: String;
    isbn: String;
}