import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './mongoose-config.service';
import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';

@Module({
  imports: 
  [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }),

  MongooseModule.forRootAsync({
    useClass: MongooseConfigService
  }),

  UserModule,
  ArticleModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
