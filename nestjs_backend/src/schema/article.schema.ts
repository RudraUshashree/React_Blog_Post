import { Types, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { USER_MODEL } from './user.schema';

@Schema({
    timestamps: true,
})
export class Article {

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: USER_MODEL })
    userId: Types.ObjectId;

    @Prop({ 
        required: true 
    })
    title: string;

    @Prop({
        required: true
    })
    content: string;

    @Prop({
        required: true
    })
    image: string;

    @Prop({
        default: "Active"
    })
    status: string;
}

export type ArticleDocument = Article & Document;
export const ArticleSchema = SchemaFactory.createForClass(Article);
export const ARTICLE_MODEL = Article.name;