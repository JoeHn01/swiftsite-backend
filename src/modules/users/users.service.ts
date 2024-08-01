import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './users.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async addUser(username: string, name: string, email: string, password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ username, name, email, password: hashedPassword });
    const result = await newUser.save();
    return result._id as string;
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

  async updateUser(id: string, username: string, name: string, email: string, password: string): Promise<void> {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const updateData: Partial<User> = { username, name, email, password: hashedPassword };
    updateData.updatedAt = new Date();

    const result = await this.userModel.updateOne({ _id: id }, { $set: updateData }).exec();
    if (result.matchedCount === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  async deleteUser(id: string): Promise<void> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}
