import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const status = error.response ? error.response.status : null;

        switch (status) {
            case 401:
                console.error("Unauthorized access 401 - automatically logging out the user.");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login";
                break;
            case 403:
                console.error("Forbidden access 403 - you do not have permission to access this resource.");
                break;
            case 404:
                console.error("Resource not found 404 - the requested resource could not be found.");
                break;
            case 500:
                console.error("Internal server error 500 - there was a problem with the server.");
                break;
            default:
                console.error(`An error occurred: ${error.message}`);
        }
        return Promise.reject(error);
    }
);

export default api;