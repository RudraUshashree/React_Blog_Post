import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ARTICLE_MODEL, ArticleSchema } from "src/schema/article.schema";
import { ArticleController } from "./article.controller";
import { ArticleService } from "./article.service";
import { AuthMiddleware } from "src/middlewares/auth.middleware";

const MODELS = [
  {
    name: ARTICLE_MODEL,
    schema: ArticleSchema
  }
];

@Module({
  imports: [MongooseModule.forFeature(MODELS)],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [MongooseModule, ArticleService]
})
export class ArticleModule { 
    configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(AuthMiddleware)
          .forRoutes(
            { path: 'article', method: RequestMethod.GET },
            { path: 'article/:id', method: RequestMethod.GET },
            { path: 'article/add-article', method: RequestMethod.POST },
            { path: 'article/:id', method: RequestMethod.PUT },
            { path: 'article/:id', method: RequestMethod.DELETE },
          );
    }
}