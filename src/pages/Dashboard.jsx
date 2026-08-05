import { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Alert,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import DashboardCard from "../components/DashboardCard";
import api from "../services/api";

import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import StarIcon from "@mui/icons-material/Star";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalClients: 0,
    totalProducts: 0,
    totalOrders: 0,
    ordersPending: 0,
    ordersShipped: 0,
    ordersDelivered: 0,
    lowStockProducts: [],
    topProduct: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [clientsRes, productsRes, ordersRes] = await Promise.all([
          api.get("/clients").catch(() => ({ data: [] })),
          api.get("/products").catch(() => ({ data: [] })),
          api.get("/orders").catch(() => ({ data: [] })),
        ]);

        const clients = clientsRes.data || [];
        const products = productsRes.data || [];
        const orders = ordersRes.data || [];

        const pending = orders.filter((o) => o.status === "PENDING").length;
        const shipped = orders.filter((o) => o.status === "SHIPPED").length;
        const delivered = orders.filter((o) => o.status === "DELIVERED").length;

        const lowStock = products.filter((p) => p.quantity <= 5);

        setStats({
          totalClients: clients.length,
          totalProducts: products.length,
          totalOrders: orders.length,
          ordersPending: pending,
          ordersShipped: shipped,
          ordersDelivered: delivered,
          lowStockProducts: lowStock,
          topProduct: products[0] || null,
        });
      } catch (err) {
        console.error("Error while fetching dashboard data :", err);
        setError("Cannot fetch dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Welcome, {user?.firstName} {user?.lastName} — Role :{" "}
          <strong>{user?.role}</strong>
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard
            title="Total Clients"
            value={stats.totalClients}
            icon={<PeopleIcon fontSize="inherit" />}
            color="primary.main"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard
            title="Total Products"
            value={stats.totalProducts}
            icon={<InventoryIcon fontSize="inherit" />}
            color="secondary.main"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={<ShoppingCartIcon fontSize="inherit" />}
            color="info.main"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard
            title="Waiting Orders"
            value={stats.ordersPending}
            icon={<PendingActionsIcon fontSize="inherit" />}
            color="warning.main"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard
            title="Shipped Orders"
            value={stats.ordersShipped}
            icon={<LocalShippingIcon fontSize="inherit" />}
            color="warning.dark"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard
            title="Delivered Orders"
            value={stats.ordersDelivered}
            icon={<CheckCircleIcon fontSize="inherit" />}
            color="success.main"
          />
        </Grid>

        {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <WarningAmberIcon color="error" />
                <Typography variant="h6" color="error">
                  Low Stock Alert ({stats.lowStockProducts.length})
                </Typography>
              </Box>
              {stats.lowStockProducts.length === 0 ? (
                <Typography variant="body2" color="textSecondary">
                  No products with low stock.
                </Typography>
              ) : (
                stats.lowStockProducts.map((p) => (
                  <Typography key={p.id} variant="body2" sx={{ py: 0.5 }}>
                    • <strong>{p.name}</strong> (Remaining : {p.quantity})
                  </Typography>
                ))
              )}
            </Paper>
          </Grid>
        )}

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <StarIcon color="warning" />
              <Typography variant="h6">Top Product / Popular</Typography>
            </Box>
            {stats.topProduct ? (
              <Box>
                <Typography variant="body1">
                  <strong>Name :</strong> {stats.topProduct.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Category : {stats.topProduct.category}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Price : {stats.topProduct.price} MAD
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No data available.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
