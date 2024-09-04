import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CategoriesService } from "./categories.service";

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Post()
    async addCategory(
        @Body('name') name: string,
        @Body('description') description: string,
        @Body('templateIds') templateIds: string[],
    ) {
        const categoryId = await this.categoriesService.addCategory(name, description, templateIds);
        return { _id: categoryId };
    }

    @Get()
    async getAllCategories() {
        return this.categoriesService.getCategories();
    }

    @Get(':categoryId')
    async getCategory(@Param('categoryId') categoryId: string) {
        return this.categoriesService.getCategory(categoryId);
    }

    @Put(':categoryId')
    async updateCategory(
        @Param('categoryId') categoryId: string,
        @Body('name') name: string,
        @Body('description') description: string,
        @Body('templateIds') templateIds: string[],
    ) {
        return this.categoriesService.updateCategory(categoryId, name, description, templateIds);
    }

    @Delete(':categoryId')
    async deleteCategory(@Param('categoryId') categoryId: string) {
        return this.categoriesService.deleteCategory(categoryId);
    }
}
