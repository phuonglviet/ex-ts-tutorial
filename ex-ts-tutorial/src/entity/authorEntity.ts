import { validate, validateOrReject, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max, IsAlphanumeric, MinLength, IsDateString, IsISO8601 } from "class-validator";
import * as validator from 'class-validator'
import { CustomIsNotAlphanumeric } from "../extension/classValidator/customIsNotAlphanumeric";

export class AuthorEntity {

    @MinLength(1, {
        message: "First name must be specified."
    })
    @validator.Validate(CustomIsNotAlphanumeric, {
        message: "First name has non-alphanumeric characters."
    })
    first_name: string;

    @MinLength(1, {
        message: "Family name must be specified."
    })
    @validator.Validate(CustomIsNotAlphanumeric, {
        message: "Family name has non-alphanumeric characters."
    })
    family_name: string;

    @IsISO8601({
        message: "Invalid date of birth."
    })
    date_of_birth: Date;

    @IsISO8601({
        message: "Invalid date of death."
    })
    date_of_death: Date;

    /**
     * Constructor
     *
     * @constructor
     */
    constructor(first_name: string, family_name: string, date_of_birth: Date, date_of_death: Date) {
        this.first_name = first_name;
        this.family_name = family_name;
        this.date_of_birth = date_of_birth;
        this.date_of_death = date_of_death;
    }
}