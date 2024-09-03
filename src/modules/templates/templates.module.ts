import { MongooseModule } from '@nestjs/mongoose';
import { Template, TemplateSchema } from './templates.schema';
import { Module } from '@nestjs/common';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Template.name, schema: TemplateSchema }]),
  UsersModule,
  ],
  controllers: [TemplatesController],
  providers: [TemplatesService],
})
export class TemplatesModule {}
