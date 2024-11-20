import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as bcrypt from 'bcryptjs';

@Schema({
    timestamps: true,
})
export class User {

    @Prop({
        required: true
    })
    name: string;

    @Prop({
        required: true
    })
    email: string;

    @Prop({
        required: true
    })
    password: string;

    @Prop({
        select: false
    })
    token: string;

    isValid: (userPwd: string) => Promise<Boolean>;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
export const USER_MODEL = User.name;

// Middleware
UserSchema.pre<UserDocument>("save", async function (next: Function) {
    const hassedPwd = await bcrypt.hash(this.password, +process.env.SALT);
    this.password = hassedPwd;
    next();
})

UserSchema.method("isValid", async function (userPwd: string) {
    const hassedPwd = this.password;
    const isMatched = await bcrypt.compare(userPwd, hassedPwd);
    return isMatched;
})