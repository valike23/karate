
export interface  Iclub{
    id?: number;
    club_name?: string;
    flag?: string;
}
export interface Icategory{
    id?: number;
    category_name?: string;
    active?: boolean;
}

export interface Iathlete {
    id?: number;
    active_time?: Date;
    result?: number;
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
export interface Ipool{
    id?: number;
    pool_name?: string;
    category_id?: string;
    category?: Icategory;
    athletes?: Iathlete[];
    active_time?: Date;
}
export interface IpoolAthlete{
    pool?: Ipool;
    pool_id?: number;
    athletes?: Iathlete[];
    athlete_id?: number;
    result?: number;
    active_time?: Date;
    end_time?: Date;
}

export interface Ikata{
    id?: number;
    kata_name?: string;
}