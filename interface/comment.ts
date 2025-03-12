export interface ICommentThread {
    id:             number;
    thread_id:      number;
    user:           User;
    favorite:       boolean;
    favorite_count: number;
    content:           string;
}



export interface ICommentReview {
    id:             number;
    review_id:      number;
    user:           User;
    favorite:       boolean;
    favorite_count: number;
    content:        string;
}

export interface User {
    id:             number;
    full_name:      string;
    email:          string;
    birthday:       null;
    sensitive_skin: boolean;
    image:          string;
}
