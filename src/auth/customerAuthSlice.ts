import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/customer_api";

interface CustomerState {
    token: string | null;
    refreshtoken: string | null;
    loading: boolean;
    error: string | null;
    userId: string | null;
    isLoggedIn: boolean;
}

const initialState: CustomerState = {
    token: localStorage.getItem('customer_token'),
    refreshtoken: localStorage.getItem('refresh_token'),
    loading: false,
    error: null,
    userId: localStorage.getItem('customer_id'),
    isLoggedIn: !!localStorage.getItem('customer_token'),
}

export const customerLogin = createAsyncThunk(
    'customer/login',
    async ({ email, password, rememberMe }: { email: string, password: string, rememberMe: boolean }, thunkAPI) => {
        try {
            const res = await api.post('/customer/login', { email, password, rememberMe})
            return res.data
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data || 'Login failed')
        }
    }
)

const customerAuthSlice = createSlice({
    name: 'customerAuth',
    initialState,
    reducers: {
        logoutCustomer(state) {
            localStorage.removeItem('customer_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('customer_id');
            state.token = null;
            state.isLoggedIn = false;
            state.userId = null;
        },
        restoreCustomerSession(state) {
            const token = localStorage.getItem('customer_token');
            const userId = localStorage.getItem('customer_id');
            if (token && userId) {
                state.token = token;
                state.userId = userId;
                state.isLoggedIn = true;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(customerLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(customerLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.data.token;
                state.userId = action.payload.data.customer.id;
                localStorage.setItem('customer_token', action.payload.data.token);
                localStorage.setItem('refresh_token', action.payload.data.refreshToken);
                localStorage.setItem('customer_id', action.payload.data.customer.id);
                state.isLoggedIn = true;
            })
            .addCase(customerLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    }
})

export const { logoutCustomer, restoreCustomerSession } = customerAuthSlice.actions;
export default customerAuthSlice.reducer;
