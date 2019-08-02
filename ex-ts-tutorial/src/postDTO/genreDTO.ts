import {validate, Contains, IsInt, Length, MinLength, MaxLength, IsEmail, IsFQDN, IsDate, Min, Max} from "class-validator";
 
export class Post {
 
    @MinLength(10, {
        message: "Title is too short"
    })
    @MaxLength(50, {
        message: "Title is too long"
    })
    title: string;
 
    @Contains("hello")
    text: string;
 
    @IsInt()
    @Min(0)
    @Max(10)
    rating: number;
 
    @IsEmail()
    email: string;
 
    @IsFQDN()
    site: string;
 
    @IsDate()
    createDate: Date;
 
}
 
let post = new Post();
post.title = "Hello"; // should not pass
post.text = "this is a great post about hell world"; // should not pass
post.rating = 11; // should not pass
post.email = "google.com"; // should not pass
post.site = "googlecom"; // should not pass
 
validate(post).then(errors => { // errors is an array of validation errors
    if (errors.length > 0) {
        console.log("validation failed. errors: ", errors);
    } else {
        console.log("validation succeed");
    }
});