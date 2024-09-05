import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { NewsService } from "./news.service";

@Controller('news')
export class NewsController {
    constructor(private readonly newsService: NewsService) {}

    @Post()
    async addNews(
        @Body('title') title: string,
        @Body('content') content: string,
        @Body('category') category: string,
    ) {
        const newsId = await this.newsService.addNews(title, content, category);
        return { _id: newsId };
    }

    @Get()
    async getAllNews() {
        return this.newsService.getAllNews();
    }

    @Get(':newsId')
    async getNews(@Param('newsId') newsId: string) {
        return this.newsService.getNews(newsId);
    }

    @Put(':newsId')
    async updateNews(
        @Param('newsId') newsId: string,
        @Body('title') title: string,
        @Body('content') content: string,
        @Body('category') category: string,
    ) {
        return this.newsService.updateNews(newsId, title, content, category);
    }

    @Delete(':newsId')
    async deleteNews(@Param('newsId') newsId: string) {
        return this.newsService.deleteNews(newsId);
    }
}
