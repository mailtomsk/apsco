import axios,{AxiosError, AxiosResponse} from "axios";
const baseURL = import.meta.env.VITE_ADMIN_API_URL
let _adminToken: string | null = null;

interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
}

const adminClient = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

adminClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("_adminToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: Error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
adminClient.interceptors.response.use(
    (response : AxiosResponse<ApiResponse>) => {
        if (!response.data.success) {
            return Promise.reject(new Error(response.data.message || "Unknown error occurred"));
          }
          return response;
    },
    (error : AxiosError<any>) => {
        let errorMessage = "Something went wrong!";
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    errorMessage = error.response.data.message || "Bad Request. Please check your input.";
                break;
                case 401:
                    errorMessage = "Unauthorized. Please log in again.";
                    localStorage.removeItem("_adminToken");
                    window.location.href = "/admin/login";
                break;
                case 403:
                    errorMessage = error.response.data.message ||  "Forbidden. You don't have permission.";
                break;
                case 404:
                    errorMessage = error.response.data.message ||  "Resource not found.";
                break;
                case 500:
                    errorMessage = error.response.data.message || "Internal server error. Please try again later.";
                break;
                default:
                    errorMessage = errorMessage || "An unexpected error occurred.";
            }
        } else if (error.request) {
            errorMessage = "Network error. Please check your internet connection.";
        }
        return Promise.reject(new Error(errorMessage));
    }
);

export default adminClient;