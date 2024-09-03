import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TemplatesService } from './templates.service';

@Controller('templates')
export class TemplatesController {
    constructor(private readonly templatesService: TemplatesService) {}

    @Post()
    async addTemplate(
        @Body('name') name: string,
        @Body('description') description: string,
        @Body('previewImage') previewImage: string,
        @Body('code') code: {html: string, css: string, js: string},
    ) {
        const templateId = await this.templatesService.addTemplate(name, description, previewImage, code);
        return { _id: templateId };
    }

    @Get()
    async getAllTemplates() {
        return this.templatesService.getTemplates();
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
    ) {
        return this.templatesService.updateTemplate(templateId, name, description, previewImage, code);
    }

    @Delete(':templateId')
    async deleteTemplate(@Param('templateId') templateId: string) {
        return this.templatesService.deleteTemplate(templateId);
    }
}
