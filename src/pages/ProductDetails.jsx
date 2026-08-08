import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Box, Button, CircularProgress, Divider, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import productService from '../services/productService';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getProductById(id)
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Product not found", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;
  if (!product) return <Container sx={{ mt: 4 }}><Typography color="error">Product not found.</Typography></Container>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="h4" fontWeight="bold" sx={{ flexGrow: 1 }}>
            Product Details
          </Typography>
          <Button startIcon={<ArrowBackIcon />} variant="outlined" onClick={() => navigate('/products')}>
            Back to List
          </Button>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        <Box display="flex" gap={2} mb={2}>
          <Chip label={product.category} color="primary" variant="outlined" />
          {product.stockAmount <= 5 && <Chip label="Low Stock" color="error" />}
        </Box>

        <Typography variant="h6" gutterBottom><strong>Name :</strong> {product.name}</Typography>
        <Typography variant="h6" gutterBottom><strong>Price :</strong> {product.price} MAD</Typography>
        <Typography variant="h6" gutterBottom><strong>Stock Amount :</strong> {product.stockAmount}</Typography>
        <Typography variant="h6" gutterBottom><strong>Category :</strong> {product.category}</Typography>
      </Paper>
    </Container>
  );
};

export default ProductDetails;