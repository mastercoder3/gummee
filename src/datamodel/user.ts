export interface User{
    email:string;
    name:string;
    phone:string;
    savedDeals:string[];
    influencer:boolean;
    photo?:string;
    uid?:string;
    token?:string;
}