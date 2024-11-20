import { BadRequestException, ConflictException, Injectable, NotFoundException, ServiceUnavailableException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { USER_MODEL, UserDocument } from "src/schema/user.schema";
import { AddUserDTO } from "./dtos/add-user.dto";
import * as jwt from 'jsonwebtoken';
import { Request } from "express";

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
     * This method creates a new article in the database using the provided DTO.
     * @param AddUserDTO The DTO containing the details of the article to be added.
     * @returns A message indicating the result of the article creation operation.
     * @throws BadRequestException if there is a validation error.
     * @throws ServiceUnavailableException if the article could not be created due to server issues.
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

    /**
     * Extracts and decodes the JWT token from the request headers.
     * @param req The request object containing the authorization header.
     * @param res The response object (not used in this method).
     * @returns The decoded userId from the JWT token.
     */
    getId(req: Request, res: Response) {
        const token = req.headers.authorization.split(" ")[1];
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as jwt.JwtPayload;
        return decode.userId;
    };

    /**
     * Generate a JWT token for a user based on their email and id.
     * @param email The email of the user.
     * @param id The id of the user.
     * @returns The generated JWT token.
     */
    generateToken(email: string, id: any) {
        return jwt.sign({ email: email, userId: id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPRIE_TIME })
    }

    /**
     * Validates the user by checking their email and password.
     * It searches in the Admin and Employee collections, and checks if the employee is active.
     * @param email The email of the user to validate.
     * @param password The password of the user to validate.
     * @returns The user object if valid, along with their role.
     * @throws UnauthorizedException If the user is not active or if the password is incorrect.
     * @throws NotFoundException If the email does not exist in either Admin or Employee collection.
     */
    async validateUser(email: string, password: string) {

        let user = await this.userModel.findOne({ email: email });

            if (!user) {
                throw new NotFoundException('Invalid Email');
            }

        // If user is found and password matches
        if (user && (await user.isValid(password))) {
            const { password, ...result } = user.toObject();
            return { ...result };
        } else {
            throw new UnauthorizedException('Invalid Password');
        }
    }

    /**
     * Handles the login process by validating the user's credentials and generating a JWT token.
     * @param email The email of the user attempting to log in.
     * @param password The password of the user attempting to log in.
     * @returns A message, the user data, and the generated JWT token.
     * @throws UnauthorizedException If the login credentials are invalid.
     */
    async login(email: string, password: string) {
        const user = await this.validateUser(email, password);

        // Generate a token if the password matches
        let token = this.generateToken(user.email, user._id);

        if (token) {
            const tokenObj = { token };
            await this.userModel.findByIdAndUpdate(user._id, { $set: tokenObj });

            // Return a success message, user and the token
            return {
                message: 'Login Successfully',
                user: user,
                token: token
            };
        }
    }
}