import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { State, Area } from '../data/malaysiaLocations';
import { ServiceCenter } from '../data/serviceCenters';
interface CarDetails {
    brand: string;
    model: string;
    year: string;
    plateNumber: string;
}

interface ServiceDetails {
    selectedServices: string[];
    remarks: string;
    packageType: string;
}


interface BookingState {
    step: string;
    selectedState: State | null;
    selectedArea: Area | null;
    selectedCenter: ServiceCenter | null;
    appointmentDate: string | null;
    appointmentTime: string | null;
    carDetails: CarDetails | null;
    serviceDetails: ServiceDetails | null;
}

const initialState: BookingState = {
    step: 'login',
    selectedState: null,
    selectedArea: null,
    selectedCenter: null,
    appointmentDate: null,
    appointmentTime: null,
    carDetails: null,
    serviceDetails: null,
};

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        setStep(state, action: PayloadAction<string>) {
            state.step = action.payload
        },
        setLocation(state, action) {
            const { selectedState, selectedArea, selectedCenter } = action.payload;
            state.selectedState = selectedState;
            state.selectedArea = selectedArea;
            state.selectedCenter = selectedCenter;
        },
        setAppointment(state, action) {
            const { appointmentDate, appointmentTime } = action.payload;
            state.appointmentDate = appointmentDate;
            state.appointmentTime = appointmentTime;
        },
        setCarDetails(state, action) {
            const { carDetails } = action.payload;
            state.carDetails = carDetails;
        },
        setServiceDetails(state, action) {
            const { serviceDetails } = action.payload;
            state.serviceDetails = serviceDetails;
        },
        resetBooking(state) {
            Object.assign(state, initialState);
        },
    }
})

export const { setStep, setLocation, setAppointment, setCarDetails, setServiceDetails, resetBooking, } = bookingSlice.actions;

export default bookingSlice.reducer;