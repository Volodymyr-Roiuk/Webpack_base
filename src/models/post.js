class Post {
    constructor(title, author) {
        this.title = title;
        this.author = author;
    }

    toJSON() {
        return JSON.stringify({title: this.title, author: this.author}, null, 2);
    }
}

export default Post;