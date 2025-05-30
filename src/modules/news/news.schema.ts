import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ObjectId } from 'mongodb';

@Schema()
export class News extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: ObjectId, ref: 'User', required: true })
  authorId: string;

  @Prop({ required: true })
  category: string;

  @Prop()
  featured: Boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const NewsSchema = SchemaFactory.createForClass(News);
