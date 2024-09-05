import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
// import { User } from '../users/users.schema';

@Schema()
export class News extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  // @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  // author: User;

  @Prop({ required: true })
  category: string;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const NewsSchema = SchemaFactory.createForClass(News);
