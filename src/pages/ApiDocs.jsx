import { Container, Paper, Typography, Box } from '@mui/material';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const ApiDocs = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box mb={3}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          API Documentation
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Interactive UI for exploring the API endpoints and their specifications.
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 2, bgcolor: 'white' }}>
        <SwaggerUI url="http://localhost:8080/v3/api-docs" />
      </Paper>
    </Container>
  );
};

export default ApiDocs;