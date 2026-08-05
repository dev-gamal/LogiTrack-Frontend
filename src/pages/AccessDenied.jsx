import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 10 }}>
      <Box sx={{ p: 4, bgcolor: '#fff0f0', borderRadius: 2 }}>
        <Typography variant="h1" color="error" fontWeight="bold">403</Typography>
        <Typography variant="h5" gutterBottom>Access Denied</Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          You do not have the necessary permissions (insufficient role) to access this page.
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/dashboard')}>
          Return to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default AccessDenied;