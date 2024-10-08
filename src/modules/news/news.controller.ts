import { Body, Controller, Delete, Get, Param, Post, Put, HttpException, HttpStatus } from "@nestjs/common";
import { NewsService } from "./news.service";
import { News } from "./news.schema";

@Controller('news')
export class NewsController {
    constructor(private readonly newsService: NewsService) {}

    @Post()
    async addNews(
        @Body('title') title: string,
        @Body('content') content: string,
        @Body('category') category: string,
        @Body('authorId') authorId: string,
        @Body('featured') featured: boolean
    ) {
        try {
            const newsId = await this.newsService.addNews(title, content, category, authorId, featured);
            return { _id: newsId };
        } catch (error) {
            throw new HttpException(error.message || 'Failed to add news', HttpStatus.BAD_REQUEST);
        }
    }

    @Get()
    async getAllNews() {
        try {
            return await this.newsService.getAllNews();
        } catch (error) {
            throw new HttpException(error.message || 'Failed to retrieve news', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('featured')
    async getFeaturedNews(): Promise<News[]> {
        try {
            return await this.newsService.getFeaturedNews();
        } catch (error) {
            throw new HttpException(error.message || 'Failed to retrieve featured news', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':newsId')
    async getNews(@Param('newsId') newsId: string) {
        try {
            const news = await this.newsService.getNews(newsId);
            if (!news) {
                throw new HttpException('News item not found', HttpStatus.NOT_FOUND);
            }
            return news;
        } catch (error) {
            throw new HttpException(error.message || 'Failed to retrieve news item', HttpStatus.BAD_REQUEST);
        }
    }

    @Put(':newsId')
    async updateNews(
        @Param('newsId') newsId: string,
        @Body('title') title: string,
        @Body('content') content: string,
        @Body('category') category: string,
        @Body('authorId') authorId: string,
        @Body('featured') featured: boolean,
    ) {
        try {
            const updatedNews = await this.newsService.updateNews(newsId, title, content, category, authorId, featured);
            if (!updatedNews) {
                throw new HttpException('News item not found for update', HttpStatus.NOT_FOUND);
            }
            return updatedNews;
        } catch (error) {
            throw new HttpException(error.message || 'Failed to update news item', HttpStatus.BAD_REQUEST);
        }
    }

    @Delete(':newsId')
    async deleteNews(@Param('newsId') newsId: string) {
        try {
            const newsExists = await this.newsService.getNews(newsId);
            if (!newsExists) {
                throw new HttpException('News item not found', HttpStatus.NOT_FOUND);
            }

            await this.newsService.deleteNews(newsId);
            return { message: 'News item deleted successfully' };
        } catch (error) {
            throw new HttpException(error.message || 'Failed to delete news item', HttpStatus.BAD_REQUEST);
        }
    }
}
