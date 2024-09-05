import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { News } from './news.schema';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private readonly newsModel: Model<News>,
  ) {}

  async addNews(title: string, content: string, category: string): Promise<string> {
    const newNews = new this.newsModel({ title, content, category });
    const result = await newNews.save();
    return result._id.toString();
  }

  async getAllNews(): Promise<News[]> {
    return await this.newsModel.find().exec();
  }

  async getNews(id: string): Promise<News> {
    const news = await this.newsModel.findById(id).exec();
    if (!news) {
        throw new NotFoundException(`News item with ID ${id} not found`);
    }
    return news;
  }

  async updateNews(id: string, title: string, content: string, category: string): Promise<News> {
    const updateData: Partial<News> = { title, content, category };
    updateData.updatedAt = new Date();

    const result = await this.newsModel.findOneAndUpdate({ _id: id }, { $set: updateData }, { new: true }).exec();
    if (!result) {
      throw new NotFoundException(`News item with ID ${id} not found`);
    }
    return result;
  }

  async deleteNews(id: string): Promise<{ success: boolean, message: string }> {
    const result = await this.newsModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
        return { success: false, message: `News item with ID ${id} not found` };
    }
    return { success: true, message: 'News item deleted successfully' };
  }
}
