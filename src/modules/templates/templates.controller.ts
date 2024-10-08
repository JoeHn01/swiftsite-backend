import { Body, Controller, Delete, Get, Param, Post, Put, Query, HttpException, HttpStatus } from '@nestjs/common';
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
        @Body('code') code: { html: string; css: string; js: string },
        @Body('categoryName') categoryName: string,
        @Body('userId') userId: string,
        @Body('featured') featured: boolean,
    ) {
        try {
            const templateId = await this.templatesService.addTemplate(name, description, previewImage, code, categoryName, userId, featured);
            return { _id: templateId };
        } catch (error) {
            throw new HttpException(error.message || 'Failed to create template', HttpStatus.BAD_REQUEST);
        }
    }

    @Get()
    async getAllTemplates() {
        try {
            return await this.templatesService.getTemplates();
        } catch (error) {
            throw new HttpException(error.message || 'Failed to retrieve templates', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('search')
    async searchTemplates(@Query('q') query: string) {
        try {
            return await this.templatesService.searchTemplates(query);
        } catch (error) {
            throw new HttpException(error.message || 'Search failed', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('featured')
    async getFeaturedTemplates(): Promise<Template[]> {
        try {
            return await this.templatesService.getFeaturedTemplates();
        } catch (error) {
            throw new HttpException(error.message || 'Failed to retrieve featured templates', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':templateId')
    async getTemplate(@Param('templateId') templateId: string) {
        try {
            return await this.templatesService.getTemplate(templateId);
        } catch (error) {
            throw new HttpException(error.message || 'Template not found', HttpStatus.NOT_FOUND);
        }
    }

    @Put(':templateId')
    async updateTemplate(
        @Param('templateId') templateId: string,
        @Body('name') name: string,
        @Body('description') description: string,
        @Body('previewImage') previewImage: string,
        @Body('code') code: { html: string; css: string; js: string },
        @Body('categoryName') categoryName: string,
        @Body('userId') userId: string,
        @Body('featured') featured: boolean,
    ) {
        try {
            return await this.templatesService.updateTemplate(templateId, name, description, previewImage, code, categoryName, userId, featured);
        } catch (error) {
            throw new HttpException(error.message || 'Failed to update template', HttpStatus.BAD_REQUEST);
        }
    }

    @Delete(':templateId')
    async deleteTemplate(@Param('templateId') templateId: string) {
        try {
            const templateExists = await this.templatesService.getTemplate(templateId);
            if (!templateExists) {
                throw new HttpException('Template not found', HttpStatus.NOT_FOUND);
            }
    
            await this.templatesService.deleteTemplate(templateId);
            return { message: 'Template deleted successfully' };
        } catch (error) {
            throw new HttpException(error.message || 'Failed to delete template', HttpStatus.BAD_REQUEST);
        }
    }    
}
