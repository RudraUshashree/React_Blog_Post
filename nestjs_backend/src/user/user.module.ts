import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { USER_MODEL, UserSchema } from "src/schema/user.schema";

const MODELS = [
  {
    name: USER_MODEL,
    schema: UserSchema
  }
];

@Module({
  imports: [MongooseModule.forFeature(MODELS)],
  controllers: [UserController],
  providers: [UserService],
  exports: [MongooseModule, UserService]
})
export class UserModule { }