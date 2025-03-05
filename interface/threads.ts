export interface IThread {
    id:             number;
    user:           User;
    title:          string;
    favorite:       boolean;
    favorite_count: number;
    owner:          boolean;
    bookmark:       boolean;
    images:         Image[];
    caption:        string;
    create_at:      Date;
}

export interface Image {
    id:        number;
    thread_id: number;
    image:     string;
}

export interface User {
    id:             number;
    full_name:      string;
    email:          string;
    birthday:       null;
    sensitive_skin: boolean;
    image:          string;
}
