import { Body, Controller, Get, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { AddUserDTO } from "./dtos/add-user.dto";

@Controller("user")
export class UserController {

    /**
     * Constructor for UserController.
     * @param userService The service that handles the business logic for articles.
     */
    constructor(private userService: UserService) { }

    /**
    * This method calls the service to add an article using the AddArticleDTO.
    * @param addArticleDto The DTO that contains the details of the article to be added.
    * @returns The result of the article creation operation.
    */
    @Post("add-user")
    addUser(@Body() newUser: AddUserDTO) {
        return this.userService.addUser(newUser);
    }

    @Get("get-users")
    getUser() {
        return this.userService.getUser();
    }

     /**
     * This method calls the `login` method from the AuthService to authenticate the user.
     * @param loginDto The login credentials provided by the user (email and password).
     * @returns A token or authentication details if the login is successful.
     * @throws UnauthorizedException If the email or password is incorrect.
     */
     @Post('login')
     async login(@Body() loginDto: { email: string, password: string }) {
         const { email, password } = loginDto;
         return this.userService.login(email, password);
     }
}