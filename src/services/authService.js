import api from "./api";

const authService = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });

    if (response.data && response.data.token) {
      const token = response.data.token;
      let userData = {};
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userData = {
          id: payload.id,
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.sub,
          role: payload.role
        };
      } catch (e) {
        console.error("Failed to parse token payload", e);
      }
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    return !!token;
  },

  getUserRole: () => {
    const user = authService.getCurrentUser();
    return user ? user.role : null;
  },
};

export default authService;
