import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { News, NewsSchema } from './news.schema';
import { User, UserSchema } from '../users/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: News.name, schema: NewsSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
