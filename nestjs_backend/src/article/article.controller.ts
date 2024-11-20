import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ArticleService } from "./article.service";
import { AddArticleDTO } from "./dtos/add-article.dto";

@Controller("article")
export class ArticleController {

    /**
     * Constructor for ArticleController.
     * @param articleService The service that handles the business logic for admins.
     */
    constructor(private articleService: ArticleService) { }

    /**
    * This method calls the service to add an article using the AddArticleDTO.
    * @param AddArticleDTO The DTO that contains the details of the article to be added.
    * @returns The result of the article creation operation.
    */
    @Post("add-article")
    addUser(@Body() newArticle: AddArticleDTO) {
        return this.articleService.addArticle(newArticle);
    }

    @Get()
    getArticles() {
        return this.articleService.getArticles();
    }

    @Get(":id")
    getArticle(@Param("id") id: string) {
        return this.articleService.getArticle(id);
    }

    @Put(":id")
    updateArticle(@Param("id") id: string, @Body() updateArticle) {
        return this.articleService.updateArticle(id, updateArticle);
    }

    @Delete(":id")
    deleteArticle(@Param("id") id: string) {
        return this.articleService.deleteArticle(id);
    }
}