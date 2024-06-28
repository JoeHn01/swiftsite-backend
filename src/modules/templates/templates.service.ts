import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Template } from './templates.model';

@Injectable()
export class TemplatesService {
    private templates: Template[] = [];

    addTemplate(
        name: string, description: string, previewImage: string,
        code: {html: string, css: string, js: string}
    ): string {
        const id = uuidv4();
        const newTemplate = new Template(id, name, description, previewImage, code);
        this.templates.push(newTemplate);
        return id;
    }

    getTemplates(): Template[] {
        return [...this.templates];
    }

    getTemplate(id: string): Template {
        return this.getTemplateById(id)[0];
    }

    updateTemplate(
        id: string, name: string, description: string, previewImage: string,
        code: {html: string, css: string, js: string}
    ): void {
        const [targetTemplate, index] = this.getTemplateById(id);
        const updatedTemplate = new Template(id, name, description, previewImage, code);
        this.templates[index] = updatedTemplate;
    }

    deleteTemplate(id: string): void {
        const [, index] = this.getTemplateById(id);
        this.templates.splice(index, 1);
    }

    private getTemplateById(id: string): [Template, number] {
        const index = this.templates.findIndex(t => t.id === id);
        return [this.templates[index], index];
    }
}