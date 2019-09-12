import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, Validator } from "class-validator";

@ValidatorConstraint()
export class CustomIsNotAlphanumeric implements ValidatorConstraintInterface {

    validate(text: string, validationArguments: ValidationArguments) {
        var validator = new Validator();
        return !validator.isAlphanumeric(text);
    }
}

/*
@ValidatorConstraint({ name: "isNotAlphanumeric", async: false })
export class CustomIsNotAlphanumeric implements ValidatorConstraintInterface {

   // isNumber
    validate(text: string, args: ValidationArguments) {
        var validator = new Validator();
        return !validator.isAlphanumeric(text); // for async validations you must return a Promise<boolean> here
    }

    defaultMessage(args: ValidationArguments) { // here you can provide default error message if validation failed
        return "Text has non-alphanumeric characters.";
    }
}
*/