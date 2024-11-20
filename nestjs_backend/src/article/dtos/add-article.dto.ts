import { IsNotEmpty, IsString } from "class-validator";

export class AddArticleDTO {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsNotEmpty()
    image: string;

    @IsString()
    status: string;
}