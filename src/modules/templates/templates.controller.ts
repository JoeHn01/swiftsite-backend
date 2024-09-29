import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { Template } from './templates.schema';

@Controller('templates')
export class TemplatesController {
    constructor(private readonly templatesService: TemplatesService) {}

    @Post()
    async addTemplate(
        @Body('name') name: string,
        @Body('description') description: string,
        @Body('previewImage') previewImage: string,
        @Body('code') code: {html: string, css: string, js: string},
        @Body('categoryName') categoryName: string,
        @Body('userId') userId: string,
        @Body('featured') featured: Boolean,
    ) {
        const templateId = await this.templatesService.addTemplate(name, description, previewImage, code, categoryName, userId, featured);
        return { _id: templateId };
    }

    @Get()
    async getAllTemplates() {
        return this.templatesService.getTemplates();
    }
    
    @Get('search')
    async searchTemplates(@Query('q') query: string) {
      return this.templatesService.searchTemplates(query);
    }

    @Get('featured')
    async getFeaturedTemplates(): Promise<Template[]> {
      return this.templatesService.getFeaturedTemplates();
    }    

    @Get(':templateId')
    async getTemplate(@Param('templateId') templateId: string) {
        return this.templatesService.getTemplate(templateId);
    }

    @Put(':templateId')
    async updateTemplate(
        @Param('templateId') templateId: string,
        @Body('name') name: string,
        @Body('description') description: string,
        @Body('previewImage') previewImage: string,
        @Body('code') code: {html: string, css: string, js: string},
        @Body('categoryName') categoryName: string,
        @Body('userId') userId: string,
        @Body('featured') featured: Boolean,
    ) {
        return this.templatesService.updateTemplate(templateId, name, description, previewImage, code, categoryName, userId, featured);
    }

    @Delete(':templateId')
    async deleteTemplate(@Param('templateId') templateId: string) {
        return this.templatesService.deleteTemplate(templateId);
    }
}
