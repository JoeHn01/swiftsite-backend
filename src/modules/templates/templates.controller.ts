import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TemplatesService } from './templates.service';

@Controller('templates')
export class TemplatesController {
    constructor(private readonly templatesService: TemplatesService) {}

    @Post()
    addTemplate(
        @Body('name') name: string,
        @Body('description') description: string,
        @Body('previewImage') previewImage: string,
        @Body('code') code: {html: string, css: string, js: string},
    ) {
        const templateId = this.templatesService.addTemplate(name, description, previewImage, code);
        return { id: templateId };
    }

    @Get()
    getAllTemplates() {
        return this.templatesService.getTemplates();
    }

    @Get(':templateId')
    getTemplate(@Param('templateId') templateId: string) {
        return this.templatesService.getTemplate(templateId);
    }

    @Put(':templateId')
    updateTemplate(
        @Param('templateId') templateId: string,
        @Body('name') name: string,
        @Body('description') description: string,
        @Body('previewImage') previewImage: string,
        @Body('code') code: {html: string, css: string, js: string},
    ) {
        return this.templatesService.updateTemplate(templateId, name, description, previewImage, code);
    }

    @Delete(':templateId')
    deleteTemplate(@Param('templateId') templateId: string) {
        this.templatesService.deleteTemplate(templateId);
    }
}
