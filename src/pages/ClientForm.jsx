import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Container, Paper, Typography, TextField, Button, Box, CircularProgress } from '@mui/material';
import clientService from '../services/clientService';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  city: yup.string().required('City is required'),
});

const ClientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(isEditMode);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    if (isEditMode) {
      clientService.getClientById(id)
        .then((data) => {
          reset(data);
          setLoading(false);
        })
        .catch((err) => console.error("Error loading client :", err));
    }
  }, [id, isEditMode, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEditMode) {
        await clientService.updateClient(id, data);
      } else {
        await clientService.createClient(data);
      }
      navigate('/clients');
    } catch (error) {
      console.error("Error saving client :", error);
      alert("An error occurred while saving the client.");
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          {isEditMode ? 'Edit Client' : 'Add Client'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2 }}>
          <TextField fullWidth label="Full Name" margin="normal" {...register('name')} error={!!errors.name} helperText={errors.name?.message} />
          <TextField fullWidth label="Email" margin="normal" {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
          <TextField fullWidth label="Phone" margin="normal" {...register('phone')} error={!!errors.phone} helperText={errors.phone?.message} />
          <TextField fullWidth label="City" margin="normal" {...register('city')} error={!!errors.city} helperText={errors.city?.message} />

          <Box mt={3} display="flex" justifyContent="space-between">
            <Button variant="outlined" color="secondary" onClick={() => navigate('/clients')}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ClientForm;