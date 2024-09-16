import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './users.schema';
import { Template } from '../templates/templates.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Template.name) private readonly templateModel: Model<Template>,
) {}

  async addUser(username: string, name: string, email: string, password: string, templateIds?: string[]): Promise<string> {
    await this.validateTemplateIds(templateIds, this.templateModel);

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ username, name, email, password: hashedPassword, templateIds });
    const result = await newUser.save();
    return result._id.toString();
  }

  async getUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async getUser(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async updateUser(id: string, username: string, name: string, email: string, password: string, templateIds): Promise<User> {
    await this.validateTemplateIds(templateIds, this.templateModel);

    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const updateData: Partial<User> = { username, name, email, password: hashedPassword, templateIds };
    updateData.updatedAt = new Date();
  
    const result = await this.userModel.findOneAndUpdate({ _id: id }, { $set: updateData }, { new: true }).exec();
    if (!result) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return result;
  }

  async deleteUser(id: string): Promise<{ success: boolean; message?: string }> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      return { success: false, message: `User with id ${id} not found` };
    }
    return { success: true, message: 'User deleted successfully' };
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
