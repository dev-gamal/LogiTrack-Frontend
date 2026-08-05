import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 10 }}>
      <Box sx={{ p: 4 }}>
        <Typography variant="h1" color="primary" fontWeight="bold">404</Typography>
        <Typography variant="h5" gutterBottom>Page Not Found</Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          The page you are looking for does not exist or has been moved.
        </Typography>
        <Button variant="outlined" color="primary" onClick={() => navigate('/dashboard')}>
          Return to Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;