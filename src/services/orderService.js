import api from "./api";

const orderService = {
  getOrders: async (
    page = 0,
    size = 10,
    statut = "",
    clientId = "",
    sortBy = "orderDate",
    sortDir = "desc",
  ) => {
    const params = {
      page: page,
      size: size,
      sort: `${sortBy},${sortDir}`,
    };

    if (statut) params.statut = statut;
    if (clientId) params.clientId = clientId;

    const response = await api.get("/orders", { params });
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  createOrder: async (orderData) => {
    const response = await api.post("/orders", orderData);
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.patch(`/orders/${id}/status`, {
      statut: status,
    });
    return response.data;
  },
};

export default orderService;
