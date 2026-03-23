import axios from "axios";

const API = axios.create({
  baseURL: "https://subscription-tracker-8ifw.onrender.com/api/v1",
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

//auth apis
export const signup = (data)=> API.post("/auth/signup", data);
export const signIn = (data)=> API.post("/auth/signin", data);

//subscription apis
export const createSubscription = (data) => API.post("/subscriptions", data);
export const getUserSubscriptions = (userId) => API.get(`/subscriptions/user/${userId}`);
export const getSubscriptions = (id) => API.get(`/subscriptions/${id}`);
export const updateSubscription = (id, data) => API.put(`/subscriptions/${id}`, data);
export const cancelSubscription = (id) => API.put(`/subscriptions/cancel/${id}`);
export const deleteSubscription = (id) => API.delete(`/subscriptions/${id}`);
export const getUpcomingRenewals = (userId) => API.get(`/subscriptions/upcoming-renewals/${userId}`);
