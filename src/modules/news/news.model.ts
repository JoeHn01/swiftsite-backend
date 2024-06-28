export class News {
    constructor(
        public id: string,
        public title: string,
        public content: string,
        // public author: string, // reference to users
        public category: string,
        public createdAt: Date,
        public updatedAt: Date
    ) {}
}