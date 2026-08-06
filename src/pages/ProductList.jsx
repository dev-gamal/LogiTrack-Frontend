import { useEffect, useState, useCallback } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  IconButton,
  FormControlLabel,
  Switch,
  Grid,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import productService from "../services/productService";
import { useAuth } from "../context/AuthContext";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [category, setCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [lowStock, setLowStock] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  const { user } = useAuth();
  const navigate = useNavigate();

  const canManage = ["ADMIN", "MANAGER"].includes(user?.role);

  const fetchProducts = useCallback(async () => {
    try {
      const data = await productService.getProducts(
        page,
        rowsPerPage,
        category,
        maxPrice,
        lowStock,
        sortBy,
        sortDir,
      );
      setProducts(data.content || data);
      setTotalElements(data.totalElements || data.length || 0);
    } catch (error) {
      console.error("Error while fetching products:", error);
    }
  }, [page, rowsPerPage, category, maxPrice, lowStock, sortBy, sortDir]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchProducts]);

  const handleSort = (property) => {
    const isAsc = sortBy === property && sortDir === "asc";
    setSortDir(isAsc ? "desc" : "asc");
    setSortBy(property);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productService.deleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error("Error while deleting product:", error);
        alert("Error while deleting product.");
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold">
          Product Management
        </Typography>
        {canManage && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/products/new")}
          >
            Add Product
          </Button>
        )}
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Category"
              variant="outlined"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="number"
              label="Maximum Price (MAD)"
              variant="outlined"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={lowStock}
                  onChange={(e) => setLowStock(e.target.checked)}
                  color="error"
                />
              }
              label="Low Stock Only"
            />
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "name"}
                  direction={sortBy === "name" ? sortDir : "asc"}
                  onClick={() => handleSort("name")}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>Category</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "price"}
                  direction={sortBy === "price" ? sortDir : "asc"}
                  onClick={() => handleSort("price")}
                >
                  Price (MAD)
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "stockAmount"}
                  direction={sortBy === "stockAmount" ? sortDir : "asc"}
                  onClick={() => handleSort("stockAmount")}
                >
                  Stock
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell
                  sx={{
                    color: product.stockAmount <= 5 ? "error.main" : "inherit",
                    fontWeight: product.stockAmount <= 5 ? "bold" : "normal",
                  }}
                >
                  {product.stockAmount}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="info"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    <ViewIcon />
                  </IconButton>
                  {canManage && (
                    <>
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/products/edit/${product.id}`)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(product.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalElements}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>
    </Container>
  );
};

export default ProductList;
