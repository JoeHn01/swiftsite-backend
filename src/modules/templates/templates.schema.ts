import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

@Schema()
export class Template extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  previewImage: string;

  @Prop({ type: Object, required: true })
  code: { html: string; css: string; js: string };

  @Prop({ type: ObjectId, ref: 'Category', required: true })
  categoryId: string;

  @Prop({ type: ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop()
  featured: Boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const TemplateSchema = SchemaFactory.createForClass(Template);
