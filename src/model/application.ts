
export interface  Iclub{
    id?: number;
    club_name?: string;
    flag?: string;
}
export interface Icategory{
    id?: number;
    category_name?: string;
}

export interface Iathlete {
    id?: number;
    first_name?: string;
    last_name?: string;
    middle_name?: string;
    category_id?: number;
    state_id?: number;
    club?: Iclub;
    category?: Icategory
}
export interface IexcelAthlete {
    sn?: number;
    firstName?: string;
    lastName?: string;
    otherNames?: string;
    category?: string;
    state?: string;
}