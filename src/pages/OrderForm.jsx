import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Container, Paper, Typography, TextField, Button, Box, MenuItem, Grid, IconButton, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import orderService from '../services/orderService';
import clientService from '../services/clientService';
import productService from '../services/productService';

const schema = yup.object().shape({
  clientId: yup.number().required('Client is required'),
  orderLines: yup.array().of(
    yup.object().shape({
      productId: yup.number().required('Product is required'),
      quantity: yup.number().positive('Quantity must be a positive number').integer('Quantity must be an integer').required('Quantity is required'),
    })
  ).min(1, 'Add at least one product to the order')
});

const OrderForm = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { orderLines: [{ productId: '', quantity: 1 }] }
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'orderLines' });

  useEffect(() => {
    Promise.all([
      clientService.getClients(0, 100),
      productService.getProducts(0, 100)
    ]).then(([clientsData, productsData]) => {
      setClients(clientsData.content || clientsData);
      setProducts(productsData.content || productsData);
      setLoading(false);
    }).catch(err => {
      console.error("Error while loading data :", err);
      setLoading(false);
    });
  }, []);

  const onSubmit = async (data) => {
    try {
      await orderService.createOrder(data);
      navigate('/orders');
    } catch (error) {
      console.error("Error while creating order :", error);
      alert("Error while creating order.");
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Create a new order</Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2 }}>
          <TextField 
            select fullWidth label="Client" margin="normal"
            inputProps={register('clientId')}
            error={!!errors.clientId} helperText={errors.clientId?.message}
            defaultValue=""
          >
            {clients.map(client => (
              <MenuItem key={client.id} value={client.id}>{client.nom} ({client.email})</MenuItem>
            ))}
          </TextField>

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Order Lines</Typography>
          {errors.orderLines?.message && <Typography color="error" variant="body2">{errors.orderLines.message}</Typography>}

          {fields.map((field, index) => (
            <Grid container spacing={2} alignItems="center" key={field.id} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={7}>
                <TextField 
                  select fullWidth label="Product" size="small"
                  inputProps={register(`orderLines.${index}.productId`)}
                  error={!!errors.orderLines?.[index]?.productId}
                  helperText={errors.orderLines?.[index]?.productId?.message}
                  defaultValue={field.productId}
                >
                  {products.map(product => (
                    <MenuItem key={product.id} value={product.id} disabled={product.quantite === 0}>
                      {product.nom} (Stock: {product.quantite}) - {product.prix} MAD
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={8} sm={3}>
                <TextField 
                  fullWidth type="number" label="Quantity" size="small"
                  {...register(`orderLines.${index}.quantity`)}
                  error={!!errors.orderLines?.[index]?.quantity}
                  helperText={errors.orderLines?.[index]?.quantity?.message}
                />
              </Grid>
              <Grid item xs={4} sm={2}>
                <IconButton color="error" onClick={() => remove(index)} disabled={fields.length === 1}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}

          <Button startIcon={<AddCircleIcon />} onClick={() => append({ productId: '', quantity: 1 })} sx={{ mt: 1 }}>
            Add a product
          </Button>

          <Box mt={4} display="flex" justifyContent="space-between">
            <Button variant="outlined" color="secondary" onClick={() => navigate('/orders')}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Validation...' : 'Validate Order'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default OrderForm;