import { ISkincare } from "./skincare";


export interface IResult {
    id:          number;
    user_id:     number;
    skincare_id: number;
    image:       string;
    skincare:    ISkincare[];
    acne_type:   Type[];
    facial_type: Type[];
    create_at:   Date;
}

export interface Type {
    id:    number;
    count: number;
}