import { useEffect, useState, useCallback } from 'react';
import { 
  Container, Paper, Typography, Box, Button, TextField, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, TablePagination, 
  TableSortLabel, IconButton, Grid, MenuItem, Chip
} from '@mui/material';
import { Add as AddIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import orderService from '../services/orderService';
import { useAuth } from '../context/AuthContext';

const statusColors = {
  'PENDING': 'warning',
  'SHIPPED': 'info',
  'DELIVERED': 'success'
};

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  const [statusFilter, setStatusFilter] = useState('');
  const [clientFilter, setClientFilter] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('desc');

  const { user } = useAuth();
  const navigate = useNavigate();

  const canCreate = ['ADMIN', 'MANAGER'].includes(user?.role);

  const fetchOrders = useCallback(async () => {
    try {
      const data = await orderService.getOrders(page, rowsPerPage, statusFilter, clientFilter, sortBy, sortDir);
      setOrders(data.content || data); 
      setTotalElements(data.totalElements || data.length || 0);
    } catch (error) {
      console.error("Error while fetching orders :", error);
    }
  }, [page, rowsPerPage, statusFilter, clientFilter, sortBy, sortDir]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => fetchOrders(), 500);
    return () => clearTimeout(delayDebounce);
  }, [fetchOrders]);

  const handleSort = (property) => {
    const isAsc = sortBy === property && sortDir === 'asc';
    setSortDir(isAsc ? 'desc' : 'asc');
    setSortBy(property);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">Orders Management</Typography>
        {canCreate && (
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => navigate('/orders/new')}>
            Create Order
          </Button>
        )}
      </Box>

      {/* Filtres */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField 
              select fullWidth label="Filter by status" variant="outlined" size="small"
              value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All statuses</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="SHIPPED">Shipped</MenuItem>
              <MenuItem value="DELIVERED">Delivered</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField 
              fullWidth label="Client ID (Filter)" variant="outlined" size="small" type="number"
              value={clientFilter} onChange={(e) => setClientFilter(e.target.value)}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Tableau */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel active={sortBy === 'id'} direction={sortBy === 'id' ? sortDir : 'asc'} onClick={() => handleSort('id')}>
                  Order #
                </TableSortLabel>
              </TableCell>
              <TableCell>Client</TableCell>
              <TableCell>
                <TableSortLabel active={sortBy === 'orderDate'} direction={sortBy === 'orderDate' ? sortDir : 'asc'} onClick={() => handleSort('orderDate')}>
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.id}</TableCell>
                <TableCell>{order.client?.name || `Client ID: ${order.clientId}`}</TableCell>
                <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip label={order.statut} color={statusColors[order.statut] || 'default'} size="small" />
                </TableCell>
                <TableCell align="center">
                  <IconButton color="info" onClick={() => navigate(`/orders/${order.id}`)}>
                    <ViewIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div" count={totalElements} page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>
    </Container>
  );
};

export default OrderList;