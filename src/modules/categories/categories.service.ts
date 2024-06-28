import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';
import { Category } from "./categories.model";

@Injectable()
export class CategoriesService {
    private categories: Category[] = [];

    addCategory(name: string, description: string) {
        const id = uuidv4();
        const newCategory = new Category(id, name, description);
        this.categories.push(newCategory);
        return id;
    }

    getCategories() {
        return [...this.categories];
    }

    getCategory(id: string) {
        return this.getCategoryById(id)[0];
    }

    updateCategory(id: string, name: string, description: string) {
        const [targetCategory, index] = this.getCategoryById(id);
        const updatedCategory = new Category(id, name, description);
        this.categories[index] = updatedCategory;
    }

    deleteCategory(id: string) {
        const [_, index] = this.getCategoryById(id);
        this.categories.splice(index, 1);
    }

    private getCategoryById(id: string): [Category, number] {
        const index = this.categories.findIndex(cat => cat.id === id);
        return [this.categories[index], index];
    }
}