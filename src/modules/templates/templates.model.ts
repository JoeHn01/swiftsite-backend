export class Template {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        // public categoryId: string,
        public previewImage: string,
        public code: {html: string, css: string, js: string},
        public createdAt: Date,
        public updatedAt: Date
    ) {}
}
