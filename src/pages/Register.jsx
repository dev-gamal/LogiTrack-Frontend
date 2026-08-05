import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import { TextField, Button, Box, Typography, Alert, Container, Paper, MenuItem } from '@mui/material';

const schema = yup.object().shape({
  nom: yup.string().required('Le nom est requis'),
  prenom: yup.string().required('Le prénom est requis'),
  email: yup.string().email('Email invalide').required('L\'email est requis'),
  password: yup.string().min(6, 'Le mot de passe doit faire au moins 6 caractères').required('Le mot de passe est requis'),
  role: yup.string().oneOf(['ADMIN', 'MANAGER', 'AGENT'], 'Rôle invalide').required('Le rôle est requis'),
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
          Inscription
        </Typography>

        {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>Inscription réussie ! Redirection...</Alert>}

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField fullWidth label="Nom" margin="normal" {...register('nom')} error={!!errors.nom} helperText={errors.nom?.message} />
          <TextField fullWidth label="Prénom" margin="normal" {...register('prenom')} error={!!errors.prenom} helperText={errors.prenom?.message} />
          <TextField fullWidth label="Email" margin="normal" {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
          <TextField fullWidth type="password" label="Mot de passe" margin="normal" {...register('password')} error={!!errors.password} helperText={errors.password?.message} />
          
          <TextField select fullWidth label="Rôle" margin="normal" defaultValue="AGENT" inputProps={register('role')} error={!!errors.role} helperText={errors.role?.message}>
            <MenuItem value="ADMIN">Administrateur</MenuItem>
            <MenuItem value="MANAGER">Manager</MenuItem>
            <MenuItem value="AGENT">Agent</MenuItem>
          </TextField>

          <Button fullWidth type="submit" variant="contained" color="primary" sx={{ mt: 3, mb: 2 }} disabled={isSubmitting}>
            S'inscrire
          </Button>
          <Typography align="center" variant="body2">
            Déjà un compte ? <Link to="/login">Se connecter</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;