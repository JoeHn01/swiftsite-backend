import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Template } from './templates.schema';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class TemplatesService {
  constructor(@InjectModel(Template.name) private readonly templateModel: Model<Template>) {}

  async addTemplate(
    name: string, description: string, previewImage: string, code: { html: string; css: string; js: string }
  ): Promise<string> {
    const newTemplate = new this.templateModel({ name, description, previewImage, code });
    const result = await newTemplate.save();
    return result._id.toString();
  }

  async getTemplates(): Promise<Template[]> {
    return this.templateModel.find().exec();
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
    code: { html: string; css: string; js: string },
  ): Promise<Template> {
    const updateData: Partial<Template> = { name, description, previewImage, code };
    updateData.updatedAt = new Date();

    const result = await this.templateModel.findOneAndUpdate({ _id: id }, { $set: updateData }, { new: true }).exec();
    if (!result) {
      throw new NotFoundException(`Template with id ${id} not found`);
    }
    return result;
  }

  async deleteTemplate(id: string): Promise<{ success: boolean; message?: string }> {
    const result = await this.templateModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
        return { success: false, message: `Template with id ${id} not found` };
    }
    return { success: true, message: 'Template deleted successfully' };
  }
}
