import { Body, Controller, Delete, Get, Param, Post, Put, HttpException, HttpStatus } from "@nestjs/common";
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
        try {
            const categoryId = await this.categoriesService.addCategory(name, description, templateIds);
            return { _id: categoryId };
        } catch (error) {
            throw new HttpException(error.message || 'Failed to add category', HttpStatus.BAD_REQUEST);
        }
    }

    @Get()
    async getAllCategories() {
        try {
            return await this.categoriesService.getCategories();
        } catch (error) {
            throw new HttpException(error.message || 'Failed to retrieve categories', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':categoryId')
    async getCategory(@Param('categoryId') categoryId: string) {
        try {
            const category = await this.categoriesService.getCategory(categoryId);
            if (!category) {
                throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
            }
            return category;
        } catch (error) {
            throw new HttpException(error.message || 'Failed to retrieve category', HttpStatus.BAD_REQUEST);
        }
    }

    @Put(':categoryId')
    async updateCategory(
        @Param('categoryId') categoryId: string,
        @Body('name') name: string,
        @Body('description') description: string,
        @Body('templateIds') templateIds: string[],
    ) {
        try {
            const updatedCategory = await this.categoriesService.updateCategory(categoryId, name, description, templateIds);
            if (!updatedCategory) {
                throw new HttpException('Category not found for update', HttpStatus.NOT_FOUND);
            }
            return updatedCategory;
        } catch (error) {
            throw new HttpException(error.message || 'Failed to update category', HttpStatus.BAD_REQUEST);
        }
    }

    @Delete(':categoryId')
    async deleteCategory(@Param('categoryId') categoryId: string) {
        try {
            const categoryExists = await this.categoriesService.getCategory(categoryId); // Check if the category exists
            if (!categoryExists) {
                throw new HttpException('Category not found', HttpStatus.NOT_FOUND); // If it does not exist, throw a 404 error
            }

            await this.categoriesService.deleteCategory(categoryId);
            return { message: 'Category deleted successfully' };
        } catch (error) {
            throw new HttpException(error.message || 'Failed to delete category', HttpStatus.BAD_REQUEST);
        }
    }
}
