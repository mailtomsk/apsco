import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminLogin as adminLoginApi} from "../services/adminService";

interface adminInitialState{
    isAuthenticated: boolean,
    _adminToken: string | null,
    admin: object | null,
    loading: boolean,
    error: string | null,
}

const initialState : adminInitialState = {
    isAuthenticated: false,
    _adminToken: null,
    admin: null,
    loading: false,
    error: null,
};

export const login = createAsyncThunk('admin/login',
    async({username, password}: {username: string, password: string}, {rejectWithValue}) => {
        try {
            const response = (await adminLoginApi({username, password})).data;
            return response;
        } catch (error: any) {
            console.error('Login failed:', error.message);
            const message = error.message ?? "Invalid credentials";
            return rejectWithValue(message || 'Login failed')
        }
    }
)

const adminAuthSlice = createSlice({
    name: "adminAuth",
    initialState,
    reducers: {
        adminLogout(state) {
            state.loading = false;
            state.admin = {},
            state._adminToken = null;
            state.error = null;
            localStorage.removeItem('_adminToken');
        },
    },
    extraReducers:(builder)=>{
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(login.fulfilled, (state, action) => {
            state._adminToken = action.payload._adminToken;
            state.admin = action.payload.admin;
            state.isAuthenticated = true;
            state.loading = false;
            localStorage.setItem('_adminToken', action.payload._adminToken);
        })
        .addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.admin = {},
            state._adminToken = null;
            state.error = action.payload as string;
        })
    }
});

export const { adminLogout } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;