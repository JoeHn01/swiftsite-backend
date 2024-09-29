import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { News } from './news.schema';
import { User } from '../users/users.schema';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private readonly newsModel: Model<News>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async addNews(title: string, content: string, category: string, authorId: string, featured: Boolean): Promise<string> {
    await this.validateUserId(authorId, this.userModel);

    const newNews = new this.newsModel({ title, content, category, authorId, featured });
    const result = await newNews.save();
    return result._id.toString();
  }

  async getAllNews(): Promise<News[]> {
    return await this.newsModel.find().exec();
  }

  async getFeaturedNews(): Promise<News[]> {
    const featuredNews = await this.newsModel.find({ featured: true }).exec();
    if (!featuredNews || featuredNews.length === 0) {
      throw new NotFoundException('No featured news found');
    }
    return featuredNews;
  }  

  async getNews(id: string): Promise<News> {
    const news = await this.newsModel.findById(id).exec();
    if (!news) {
        throw new NotFoundException(`News item with ID ${id} not found`);
    }
    return news;
  }

  async updateNews(id: string, title: string, content: string, category: string, authorId: string, featured: Boolean): Promise<News> {
    await this.validateUserId(authorId, this.userModel);

    const updateData: Partial<News> = { title, content, category, authorId, featured };
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

  private async validateUserId(userId: string, userModel: Model<User>) {
    if (!isValidObjectId(userId)) {
      throw new BadRequestException(`Invalid user ID: ${userId}`);
    }
  
    const userExists = await userModel.exists({ _id: userId });
    if (!userExists) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  }
}
