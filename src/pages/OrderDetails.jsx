import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Divider,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import orderService from "../services/orderService";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    orderService
      .getOrderById(id)
      .then((data) => {
        setOrder(data);
        setStatus(data.statut);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Order not found", err);
        setLoading(false);
      });
  }, [id]);

  const handleStatusUpdate = async () => {
    try {
      setSaving(true);
      await orderService.updateOrderStatus(id, status);
      alert("Status updated successfully !");
      setSaving(false);
    } catch (error) {
      console.error("Error while updating :", error);
      alert("Error while updating status.");
      setSaving(false);
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  if (!order)
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error">Order not found.</Typography>
      </Container>
    );

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="h4" fontWeight="bold" sx={{ flexGrow: 1 }}>
            Order #{order.id}
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            onClick={() => navigate("/orders")}
          >
            Back to Orders
          </Button>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Box
          sx={{
            mb: 4,
            p: 2,
            bgcolor: "#f5f5f5",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <TextField
            select
            label="Order Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            size="small"
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="SHIPPED">Shipped</MenuItem>
            <MenuItem value="DELIVERED">Delivered</MenuItem>
          </TextField>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleStatusUpdate}
            disabled={saving || status === order.statut}
          >
            {saving ? "Updating..." : "Update Status"}
          </Button>
        </Box>

        <Typography variant="h6" gutterBottom>
          <strong>Date :</strong>{" "}
          {new Date(order.orderDate).toLocaleString()}
        </Typography>

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          Client
        </Typography>
        {order.client ? (
          <Typography variant="body1">
            {order.client.name} ({order.client.email}) - {order.client.phone}
          </Typography>
        ) : (
          <Typography variant="body1">Client ID: {order.clientId}</Typography>
        )}

        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          Products Ordered
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right">Unit Price</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Subtotal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.orderLines?.map((line, index) => (
              <TableRow key={index}>
                <TableCell>
                  {line.product?.name || `Product ID: ${line.productId}`}
                </TableCell>
                <TableCell align="right">
                  {line.product?.price || 0} MAD
                </TableCell>
                <TableCell align="right">{line.quantity}</TableCell>
                <TableCell align="right">
                  {(line.product?.price || 0) * line.quantity} MAD
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default OrderDetails;
