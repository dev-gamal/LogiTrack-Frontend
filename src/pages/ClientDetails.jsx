import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Box, Button, CircularProgress, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import clientService from '../services/clientService';

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clientService.getClientById(id)
      .then(data => {
        setClient(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Client not found", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;
  if (!client) return <Container sx={{ mt: 4 }}><Typography color="error">Client not found.</Typography></Container>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="h4" fontWeight="bold" sx={{ flexGrow: 1 }}>
            Client Details
          </Typography>
          <Button startIcon={<ArrowBackIcon />} variant="outlined" onClick={() => navigate('/clients')}>
            Back to List
          </Button>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        <Typography variant="h6" gutterBottom><strong>ID :</strong> {client.id}</Typography>
        <Typography variant="h6" gutterBottom><strong>Name :</strong> {client.name}</Typography>
        <Typography variant="h6" gutterBottom><strong>Email :</strong> {client.email}</Typography>
        <Typography variant="h6" gutterBottom><strong>Phone :</strong> {client.phone}</Typography>
        <Typography variant="h6" gutterBottom><strong>City :</strong> {client.city}</Typography>
      </Paper>
    </Container>
  );
};

export default ClientDetails;