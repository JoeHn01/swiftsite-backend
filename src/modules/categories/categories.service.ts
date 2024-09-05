import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId  } from 'mongoose';
import { Category } from './categories.schema';
import { Template } from '../templates/templates.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    @InjectModel(Template.name) private readonly templateModel: Model<Template>,
  ) {}

  async addCategory(name: string, description: string, templateIds: string[],
  ): Promise<string> {

    await this.validateTemplateIds(templateIds, this.templateModel);
  
    const newCategory = new this.categoryModel({ name, description, templateIds });
    const result = await newCategory.save();
    return result._id.toString();
  }
  
  async getCategories(): Promise<Category[]> {
    const categories = await this.categoryModel.find().exec();
    return categories;
  }

  async getCategory(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found.`);
    }
    return category;
  }

  async updateCategory(id: string, name: string, description: string, templateIds: string[]): Promise<Category> {
    await this.validateTemplateIds(templateIds, this.templateModel);
  
    const updateData: Partial<Category> = { name, description, templateIds };
    updateData.updatedAt = new Date();
  
    const result = await this.categoryModel.findOneAndUpdate({ _id: id }, { $set: updateData }, { new: true }).exec();
    if (!result) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return result;
  }
  
   
  async deleteCategory(id: string): Promise<{ success: boolean, message: string }> {
    const result = await this.categoryModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
        return { success: false, message: `Category with id ${id} not found` };
    }
    return { success: true, message: 'Category deleted successfully' };
  }

  private async validateTemplateIds(templateIds: string[], templateModel: Model<any>) {
    // Validate that all templateIds are valid ObjectIds
    if (templateIds && templateIds.length > 0) {
      const invalidIds = templateIds.filter(id => !isValidObjectId(id));
      if (invalidIds.length > 0) {
        throw new BadRequestException(`Invalid template IDs: ${invalidIds.join(', ')}`);
      }
  
      // Check if all templateIds exist in the templates collection
      const templatesExist = await templateModel.countDocuments({ _id: { $in: templateIds } }).exec();
  
      if (templatesExist !== templateIds.length) {
        throw new NotFoundException(`One or more templates with IDs ${templateIds} not found`);
      }
    }
  }
}
