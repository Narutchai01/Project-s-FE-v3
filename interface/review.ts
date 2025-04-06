import { ISkincare } from "./skincare";

export interface IReview {
    id:             number;
    title:          string;
    favorite:       boolean;
    favorite_count: number;
    bookmark:       boolean;
    owner:          boolean;
    content:        string;
    image:          string;
    user:           User;
    create_at:      Date;
    skincares:      ISkincare[]
}

export interface User {
    id:             number;
    full_name:      string;
    email:          string;
    birthday:       null;
    sensitive_skin: boolean;
    image:          string;
    follow?:        boolean;
}

export interface Image {
    id:        number;
    review_id: number;
    image:     string;
}