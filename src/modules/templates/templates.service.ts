import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Template } from './templates.schema';
import { User } from '../users/users.schema';
import { Category } from '../categories/categories.schema';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectModel(Template.name) private readonly templateModel: Model<Template>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

  async addTemplate(name: string, description: string, previewImage: string, 
    code: { html: string; css: string; js: string }, categoryName: string, userId: string, featured: Boolean): Promise<string> {
    
    await this.validateUserId(userId, this.userModel);
    const categoryId = await this.validateOrCreateCategory(categoryName);

    const newTemplate = new this.templateModel({ name, description, previewImage, code, categoryId, userId, featured });
  
    const result = await newTemplate.save();
    return result._id.toString();
  }

  async getTemplates(): Promise<Template[]> {
    return this.templateModel.find().exec();
  }
  
  async searchTemplates(query: string): Promise<Template[]> {
    const searchRegex = new RegExp(query, 'i');
    return await this.templateModel.find({
      $or: [
        { name: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
      ]
    }).exec();
  }

  async getFeaturedTemplates(): Promise<Template[]> {
    const featuredTemplates = await this.templateModel.find({ featured: true }).exec();
    if (!featuredTemplates || featuredTemplates.length === 0) {
      throw new NotFoundException('No featured templates found');
    }
    return featuredTemplates;
  }  

  async getTemplate(id: string): Promise<Template> {
    const template = await this.templateModel.findById(id).exec();
    if (!template) {
      throw new NotFoundException(`Template with id ${id} not found`);
    }
    return template;
  }

  async updateTemplate(
    id: string, name: string, description: string, previewImage: string,
    code: { html: string; css: string; js: string; }, categoryName: string, userId: string, featured: Boolean ): Promise<Template> {

    await this.validateUserId(userId, this.userModel);
    const categoryId = await this.validateOrCreateCategory(categoryName);
  
    const updateData: Partial<Template> = { name, description, previewImage, code, categoryId, userId, featured };
    updateData.updatedAt = new Date();
  
    const result = await this.templateModel.findOneAndUpdate({ _id: id }, { $set: updateData }, { new: true }).exec();
    if (!result) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }
    return result;
  }

  async deleteTemplate(id: string): Promise<{ success: boolean; message?: string }> {
    const result = await this.templateModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
        return { success: false, message: `Category with id ${id} not found` };
    }
    return { success: true, message: 'Category deleted successfully' };
  }

  private async validateUserId(userId: string, userModel: Model<User>) {
    if (!isValidObjectId(userId)) {
      throw new BadRequestException(`Invalid Template ID: ${userId}`);
    }
  
    const userExists = await userModel.exists({ _id: userId });
    if (!userExists) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  }

  private async validateOrCreateCategory(categoryName: string): Promise<string> {
    if (!categoryName || typeof categoryName !== 'string') {
      throw new BadRequestException('Invalid category name');
    }

    let category = await this.categoryModel.findOne({ name: categoryName }).exec();
    if (!category) {
      category = new this.categoryModel({
        name: categoryName,
        description: `This is a templates category named ${categoryName}`,
      });
      await category.save();
    }
    
    return category._id.toString();
  }
}
