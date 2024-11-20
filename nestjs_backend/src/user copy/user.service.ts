import { BadRequestException, ConflictException, Injectable, ServiceUnavailableException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { USER_MODEL, UserDocument } from "src/schema/user.schema";
import { AddUserDTO } from "./dtos/add-user.dto";

@Injectable()
export class UserService {
    /**
     * Constructor for UserService.
     * @param userModel The MongoDB model to interact with the user collection in the database.
     */
    constructor(
        @InjectModel(USER_MODEL) private userModel: Model<UserDocument>,
    ) { }

    /**
     * This method creates a new admin in the database using the provided DTO.
     * @param AddUserDTO The DTO containing the details of the admin to be added.
     * @returns A message indicating the result of the admin creation operation.
     * @throws BadRequestException if there is a validation error.
     * @throws ServiceUnavailableException if the admin could not be created due to server issues.
     */
    async addUser(userData: AddUserDTO) {       
        try {
            const isUserExists = await this.userModel.findOne({ email: userData.email });
			if (isUserExists) {
                throw new ConflictException();
			}

            const user = await this.userModel.create(userData);
            if (user) {
                return {
					message: 'Registered Successfully.'
				};
            }

        } catch (error) {
            if (error.name === 'ValidationError') {
                throw new BadRequestException(error.errors);
            }

            if (error.status === 409) {
                throw new ConflictException('An user567 with this email already exists.');
            }

            throw new ServiceUnavailableException();
        }
    }

    async getUser() {
        return await this.userModel.find();
    }
}