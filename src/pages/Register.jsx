import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import { TextField, Button, Box, Typography, Alert, Container, Paper, MenuItem } from '@mui/material';

const schema = yup.object().shape({
  lastName: yup.string().required('Last name is required'),
  firstName: yup.string().required('First name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  role: yup.string().oneOf(['ADMIN', 'MANAGER', 'AGENT'], 'Invalid role').required('Role is required'),
});

const Register = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { role: 'AGENT' }
  });

  const onSubmit = async (data) => {
    try {
      setApiError('');
      await authService.register(data);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error("Registration error :", error);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
        <Typography variant="h5" align="center" gutterBottom>
          Logitrack - Registration
        </Typography>

        {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>Registration successful! Redirecting...</Alert>}

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField fullWidth label="Last Name" margin="normal" {...register('lastName')} error={!!errors.lastName} helperText={errors.lastName?.message} />
          <TextField fullWidth label="First Name" margin="normal" {...register('firstName')} error={!!errors.firstName} helperText={errors.firstName?.message} />
          <TextField fullWidth label="Email" margin="normal" {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
          <TextField fullWidth type="password" label="Password" margin="normal" {...register('password')} error={!!errors.password} helperText={errors.password?.message} />
          
          <TextField select fullWidth label="Role" margin="normal" defaultValue="AGENT" inputProps={register('role')} error={!!errors.role} helperText={errors.role?.message}>
            <MenuItem value="ADMIN">Administrator</MenuItem>
            <MenuItem value="MANAGER">Manager</MenuItem>
            <MenuItem value="AGENT">Agent</MenuItem>
          </TextField>

          <Button fullWidth type="submit" variant="contained" color="primary" sx={{ mt: 3, mb: 2 }} disabled={isSubmitting}>
            Register
          </Button>
          <Typography align="center" variant="body2">
            Already have an account? <Link to="/login">Sign in</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;