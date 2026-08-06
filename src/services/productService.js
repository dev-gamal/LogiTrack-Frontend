import api from './api';

const productService = {
  getProducts: async (page = 0, size = 10, category = '', maxPrice = '', lowStock = false, sortBy = 'name', sortDir = 'asc') => {
    const params = {
      page: page,
      size: size,
      sort: `${sortBy},${sortDir}`
    };

    if (category) params.category = category;
    if (maxPrice) params.price = maxPrice;
    if (lowStock) params.stockAmount = true;

    const response = await api.get('/products', { params });
    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }
};

export default productService;