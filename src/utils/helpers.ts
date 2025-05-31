import * as yup from 'yup';

export const loginSchema = yup.object({
    username: yup.string().required(),
    password: yup.string().required(),
});


export interface Service {
    id: string;
    name: string;
    description?:string;
    status: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface CarBrand {
    id: string;
    name: string;
    description?: string;
    status: boolean;
}
export interface CarModel {
    id: string;
    name: string;
    brand: string;
    description?: string;
    status: boolean;
}

export interface States {
    id: string;
    name: string;
    status: boolean;
}
export interface Areas {
    id: string;
    name: string;
    states: string;
    status: boolean;
}