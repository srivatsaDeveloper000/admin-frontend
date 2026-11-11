import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8009/api/admin",
    timeout: 10000,
})

api.interceptors.request.use(
    (config) => {
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) => {
        return response.data
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default api