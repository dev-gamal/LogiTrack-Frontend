import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Container, Paper, Typography, TextField, Button, Box, CircularProgress } from '@mui/material';
import productService from '../services/productService';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  category: yup.string().required('Category is required'),
  price: yup.number().typeError('Price must be a number').positive('Price must be positive').required('Price is required'),
  stockAmount: yup.number().typeError('Stock amount must be a number').integer('Stock amount must be an integer').min(0, 'Stock amount cannot be negative').required('Stock amount is required'),
});

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(isEditMode);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    if (isEditMode) {
      productService.getProductById(id)
        .then((data) => {
          reset(data);
          setLoading(false);
        })
        .catch((err) => console.error("Error loading product:", err));
    }
  }, [id, isEditMode, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEditMode) {
        await productService.updateProduct(id, data);
      } else {
        await productService.createProduct(data);
      }
      navigate('/products');
    } catch (error) {
      console.error("Error saving product:", error);
      alert("An error occurred while saving the product.");
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          {isEditMode ? 'Modify Product' : 'Add Product'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2 }}>
          <TextField fullWidth label="Product Name" margin="normal" {...register('name')} error={!!errors.name} helperText={errors.name?.message} />
          <TextField fullWidth label="Category" margin="normal" {...register('category')} error={!!errors.category} helperText={errors.category?.message} />
          <TextField fullWidth label="Price (MAD)" type="number" margin="normal" {...register('price')} error={!!errors.price} helperText={errors.price?.message} />
          <TextField fullWidth label="Stock Amount" type="number" margin="normal" {...register('stockAmount')} error={!!errors.stockAmount} helperText={errors.stockAmount?.message} />

          <Box mt={3} display="flex" justifyContent="space-between">
            <Button variant="outlined" color="secondary" onClick={() => navigate('/products')}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProductForm;