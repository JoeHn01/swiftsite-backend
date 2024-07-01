import { Injectable, NotFoundException } from "@nestjs/common";
import { News } from "./news.model";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class NewsService {
    private news: News[] = [];

    addNews(title: string, content: string, category: string) {
        const id = uuidv4();
        const createdAt = new Date();
        const updatedAt = new Date();
        const newNews = new News(id, title, content, category, createdAt, updatedAt);
        this.news.push(newNews);
        return id;
    }

    getAllNews() {
        return [...this.news];
    }

    getNews(id: string) {
        const news = this.findNews(id);
        return news;
    }

    updateNews(id: string, title: string, content: string, category: string) {
        const index = this.findNewsIndex(id);
        const targetNews = this.news[index];
        const updatedNews = new News(id, title, content, category, targetNews.createdAt, new Date());
        this.news[index] = updatedNews;
    }

    deleteNews(id: string) {
        const index = this.findNewsIndex(id);
        this.news.splice(index, 1);
    }

    private findNews(id: string): News {
        const news = this.news.find(n => n.id === id);
        if (!news) {
            throw new NotFoundException('News item not found');
        }
        return news;
    }

    private findNewsIndex(id: string): number {
        const index = this.news.findIndex(n => n.id === id);
        if (index === -1) {
            throw new NotFoundException('News item not found');
        }
        return index;
    }
}
