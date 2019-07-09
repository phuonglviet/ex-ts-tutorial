import { Document, Schema, Model } from "mongoose";
import { Moment } from "moment";

export interface IAuthor extends Document {
    first_name: {type: String, required: true, max: 100};
    family_name: {type: String, required: true, max: 100};
    date_of_birth: {type: Date};
    date_of_death: {type: Date};
}

export class AuthorModel {

    /**
   * Constructor
   *
   * @constructor
   */
  constructor() {
    
  }

}