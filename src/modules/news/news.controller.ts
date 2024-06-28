import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { NewsService } from "./news.service";

@Controller('news')
export class NewsController {
    constructor(private readonly newsService: NewsService) {}

    @Post()
    addNews(
        @Body('title') title: string,
        @Body('content') content: string,
        @Body('category') category: string,
    ) {
        const newsId = this.newsService.addNews(title, content, category);
        return { id: newsId };
    }

    @Get()
    getAllNews() {
        return this.newsService.getAllNews();
    }

    @Get(':newsId')
    getNews(@Param('newsId') newsId: string) {
        return this.newsService.getNews(newsId);
    }

    @Put(':newsId')
    updateNews(
        @Param('newsId') newsId: string,
        @Body('title') title: string,
        @Body('content') content: string,
        @Body('category') category: string,
    ) {
        this.newsService.updateNews(newsId, title, content, category);
    }

    @Delete(':newsId')
    deleteNews(@Param('newsId') newsId: string) {
        this.newsService.deleteNews(newsId);
    }
}