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
      sortBy,
      direction: sortDir,
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
    const { clientId, orderLines } = orderData;
    const orderResponse = await api.post("/orders", null, {
      params: { clientId },
    });
    const orderId = orderResponse.data.id;

    for (const line of orderLines) {
      await api.post(`/orders/${orderId}/products`, {
        productId: line.productId,
        quantite: line.quantity,
      });
    }

    return orderResponse.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, null, {
      params: { status },
    });
    return response.data;
  },
};

export default orderService;
