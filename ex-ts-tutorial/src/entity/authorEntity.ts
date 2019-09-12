import { validate, validateOrReject, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max, IsAlphanumeric } from "class-validator";
import * as validator from 'class-validator'
import { CustomIsNotAlphanumeric } from "../extension/classValidator/customIsNotAlphanumeric";

export class AuthorEntity {

    @Min(10, {
        message: "First name must be specified."
    })
    @validator.Validate(CustomIsNotAlphanumeric, {
        message: "First name has non-alphanumeric characters."
    })
    first_name: string;

    @Min(10, {
        message: "Family name must be specified."
    })
    // @validator.Validate(CustomIsNotAlphanumeric, {
    //     message: "Family name has non-alphanumeric characters."
    // })
    family_name: string;

    @IsDate({
        message: "Invalid date of birth."
    })
    date_of_birth: Date;

    @IsDate({
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