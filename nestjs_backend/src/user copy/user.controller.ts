import { Body, Controller, Get, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { AddUserDTO } from "./dtos/add-user.dto";

@Controller("user")
export class UserController {

    /**
     * Constructor for UserController.
     * @param userService The service that handles the business logic for admins.
     */
    constructor(private userService: UserService) { }

    /**
    * This method calls the service to add an admin using the AddAdminDTO.
    * @param addAdminDto The DTO that contains the details of the admin to be added.
    * @returns The result of the admin creation operation.
    */
    @Post("add-user")
    addUser(@Body() newUser: AddUserDTO) {
        return this.userService.addUser(newUser);
    }

    @Get("get-users")
    getUser() {
        return this.userService.getUser();
    }
}