
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
    active_time?: Date | string;
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

export interface IjudgePool {
    pool_id?: number;
    athlete_id?: number;
    judge_id?: number;
    athletic_performance?: number;
    technical_performance?: number;
    ath_status?: string;
    tech_status?: string;
    first_name?: string;
    last_name?: string;
}
export interface Ijudge {
    id?: number;
    name?: string;
    password?: string;
}

export interface Icompetition {
    id?: number;
    competition_name?: string;
    start_date?: Date| string;
    status?: string;
}
export interface IjudgeResult {
    athletic_performance?: number;
    technical_performance?: number;
    judge_id?: number;
    ap_color?:string;
    tc_color?: string;
}
export interface IjudgeAthleteResult {
    last_name?: string;
    first_name?: string;
    club?: string;
    kata?: string;
    athlete_id?: number;
    judgeResult?: IjudgeResult[]
}