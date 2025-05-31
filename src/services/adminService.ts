import adminClient from "./adminClient";

export const adminLogin = async(data : any) => {
    return (await adminClient.post('/v1/login', data)).data;
}

export const profile = async() => {
    return (await adminClient.get('/v1/profile')).data;
}

export const getCustomers = async() =>{
    return (await adminClient.get('/v1/customers')).data;
}

export const customerDelete = async(id: any) => {
    return (await adminClient.get(`/v1/customers/${id}/delete`)).data
}

export const getAllStateCity = async() => {
    return (await adminClient.get('/v1/service-location')).data
}

export const getAllServiceCenter = async() => {
    return (await adminClient.get('/v1/service-center')).data;
}

export const getAllBookings = async()=>{
    return (await adminClient.get('/v1/bookings')).data
}

export const getAllCounts = async()=>{
    return (await adminClient.get('/v1/dashboard')).data;
}

export const getAllServices = async() => {
    return (await adminClient.get('/v1/services')).data;
}

export const serviceStatusUpdate = async(data : any) => {
    return (await adminClient.post('/v1/services/status-update', data)).data;
}