import { useEffect, useState } from 'react';
import { 
  Container, Paper, Typography, Box, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, 
  IconButton, CircularProgress, Chip 
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import userService from '../services/userService';
import { useAuth } from '../context/AuthContext';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await userService.getUsers();
        setUsers(data.content || data); 
      } catch (error) {
        console.error("Error while fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Attention, this action is irreversible. Do you really want to delete this user?")) {
      try {
        await userService.deleteUser(id);
        
        setUsers((prevUsers) => prevUsers.filter((u) => u.id !== id));
        
      } catch (error) {
        console.error("Error while deleting user:", error);
        alert("Could not delete the user.");
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={3}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Administration and user management
        </Typography>
        <Typography variant="subtitle1" color="error" fontWeight="medium">
          Strictly reserved for Administrators
        </Typography>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Last Name</strong></TableCell>
              <TableCell><strong>First Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id} hover>
                <TableCell>{u.id}</TableCell>
                <TableCell>{u.lastName}</TableCell>
                <TableCell>{u.firstName}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={u.role} 
                    size="small"
                    color={
                      u.role === 'ADMIN' ? 'error' : 
                      u.role === 'MANAGER' ? 'warning' : 'primary'
                    } 
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton 
                    color="error" 
                    onClick={() => handleDelete(u.id)}
                    disabled={currentUser.email === u.email}
                    title={currentUser.email === u.email ? "You cannot delete your own account" : "Delete user"}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Users;