export class Post {

    public id: number;
    public title: string;
    public content: string;

    static fromObject(src) {
        return Object.assign(new Post(), src);
    }
    
}