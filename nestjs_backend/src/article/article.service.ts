import { BadRequestException, Injectable, NotFoundException, ServiceUnavailableException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ARTICLE_MODEL, ArticleDocument } from "src/schema/article.schema";
import { AddArticleDTO } from "./dtos/add-article.dto";

@Injectable()
export class ArticleService {
    /**
     * Constructor for ArticleService.
     * @param articleModel The MongoDB model to interact with the Article collection in the database.
     */
    constructor(
        @InjectModel(ARTICLE_MODEL) private articleModel: Model<ArticleDocument>,
    ) { }

    /**
     * This method creates a new article in the database using the provided DTO.
     * @param AddArticleDTO The DTO containing the details of the article to be added.
     * @returns A message indicating the result of the article creation operation.
     * @throws BadRequestException if there is a validation error.
     * @throws ServiceUnavailableException if the article could not be created due to server issues.
     */
    async addArticle(ArticleData: AddArticleDTO) {       
        try {

            const Article = await this.articleModel.create(ArticleData);
            if (Article) {
                return {
					message: 'Article Added Successfully.'
				};
            }

        } catch (error) {
            if (error.name === 'ValidationError') {
                throw new BadRequestException(error.errors);
            }

            throw new ServiceUnavailableException();
        }
    }

    async updateArticle(id: string, updatedArticleData: any) {       
        try {            
            const updatedArticle = await this.articleModel.findByIdAndUpdate(
                id, 
                { $set:  updatedArticleData }, 
                {new: true, runValidators: true });
            if (!updatedArticle) {
                throw new NotFoundException();
            } else {
                return { message: 'Article Updated Successfully.' };
            }

        } catch (error) {
            throw new NotFoundException('Article not found');

            if (error.name === 'ValidationError') {
                throw new BadRequestException(error.errors);
            }

            throw new ServiceUnavailableException();
        }
    }

    async deleteArticle(id: string) {       
        try {
            const deletedArticle = await this.articleModel.findByIdAndDelete(id);
            console.log('Delete: ',deletedArticle);
            
            if(!deletedArticle) {
                throw new NotFoundException();
            } else {
                return {message: 'Article Deleted Successfully.'};
            }

        } catch (error) {
            throw new NotFoundException('Article not found');

            if (error.name === 'ValidationError') {
                throw new BadRequestException(error.errors);
            }

            throw new ServiceUnavailableException();
        }
    }

    async getArticles() {
        return await this.articleModel.find();
    }

    async getArticle(id: string) {
        try {
            const article = await this.articleModel.findOne({_id: id});
            if(!article) {
                throw new NotFoundException();
            } else {
                return article;
            }
        } catch (error) {
            console.log('get article error: ',error);
            throw new NotFoundException('Article not found');
        }
    } 
}