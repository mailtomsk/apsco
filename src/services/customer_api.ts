import axios from "axios";
const baseURL = import.meta.env.VITE_API_URL

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});


api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("customer_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor to handle 401 / 403 errors
let isRefreshing = false;
let failedQueue: any[] = [];
const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (token) {
            prom.resolve(token);
        } else {
            prom.reject(error);
        }
    });
    failedQueue = [];
};
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response) {
            const originalRequest = error.config;
            const status = error.response.status;

            if ((status === 401 || status === 403) && !originalRequest._retry) {
                originalRequest._retry = true;
                const rememberMe = localStorage.getItem('rememberMe');
                const refreshToken = localStorage.getItem("refresh_token");
                if (rememberMe === 'true' && refreshToken) {
                    if (!isRefreshing) {
                        isRefreshing = true;
                        try {
                            const res = await api.post('/customer/refresh-token', { refreshToken });
                            const newToken = res.data.data.token;
                            localStorage.setItem('customer_token', newToken);
                            api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                            processQueue(null, newToken);
                            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                            return api(originalRequest)
                        } catch (error) {
                            processQueue(error, null);
                            localStorage.removeItem("customer_token");
                            localStorage.removeItem("customer_id");
                            import('../store').then(({ store }) => {
                                import('../auth/customerAuthSlice').then(({ logoutCustomer }) => {
                                    store.dispatch(logoutCustomer());
                                });
                            });
                            return Promise.reject(error);
                        } finally {
                            isRefreshing = false;
                        }
                    }
                    return new Promise((resolve, reject) => {
                        failedQueue.push({
                            resolve: (token: string) => {
                                originalRequest.headers['Authorization'] = `Bearer ${token}`,
                                    resolve(api(originalRequest))
                            },
                            reject: (error: any) => reject(error)
                        })
                    })
                } else {
                    localStorage.removeItem("customer_token");
                    localStorage.removeItem("customer_id");
                    localStorage.removeItem("refresh_token");
                    localStorage.removeItem("rememberMe");
                    import('../store').then(({ store }) => {
                        import('../auth/customerAuthSlice').then(({ logoutCustomer }) => {
                            store.dispatch(logoutCustomer());
                        });
                    });
                    return Promise.reject(error);
                }
            } else {
                localStorage.removeItem("customer_token");
                localStorage.removeItem("customer_id");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("rememberMe");
                import('../store').then(({ store }) => {
                    import('../auth/customerAuthSlice').then(({ logoutCustomer }) => {
                        store.dispatch(logoutCustomer());
                    });
                });
            }
        }
        return Promise.reject(error);
    }
);

export default api;