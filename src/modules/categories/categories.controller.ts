import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CategoriesService } from "./categories.service";

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Post()
    addCategory(
        @Body('name') name: string,
        @Body('description') description: string
    ) {
        const categoryId = this.categoriesService.addCategory(name, description);
        return { id: categoryId };
    }

    @Get()
    getAllCategories() {
        return this.categoriesService.getCategories();
    }

    @Get(':categoryId')
    getCategory(@Param('categoryId') categoryId: string) {
        return this.categoriesService.getCategory(categoryId);
    }

    @Put(':categoryId')
    updateCategory(
        @Param('categoryId') categoryId: string,
        @Body('name') name: string,
        @Body('description') description: string
    ) {
        this.categoriesService.updateCategory(categoryId, name, description);
    }

    @Delete(':categoryId')
    deleteCategory(@Param('categoryId') categoryId: string) {
        this.categoriesService.deleteCategory(categoryId);
    }
}