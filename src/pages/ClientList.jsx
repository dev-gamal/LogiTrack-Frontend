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
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import clientService from "../services/clientService";
import { useAuth } from "../context/AuthContext";

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  const { user } = useAuth();
  const navigate = useNavigate();

  const canManage = ["ADMIN", "MANAGER"].includes(user?.role);

  const fetchClients = useCallback(async () => {
    try {
      const data = await clientService.getClients(
        page,
        rowsPerPage,
        search,
        sortBy,
        sortDir,
      );
      setClients(data.content || data);
      setTotalElements(data.totalElements || data.length || 0);
    } catch (error) {
      console.error("Error while fetching clients :", error);
    }
  }, [page, rowsPerPage, search, sortBy, sortDir]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchClients();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchClients]);

  const handleSort = (property) => {
    const isAsc = sortBy === property && sortDir === "asc";
    setSortDir(isAsc ? "desc" : "asc");
    setSortBy(property);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Do you really want to delete this client?")) {
      try {
        await clientService.deleteClient(id);
        fetchClients();
      } catch (error) {
        console.error("Error while deleting client :", error);
        alert("Error while deleting client.");
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
          Clients Management
        </Typography>
        {canManage && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/clients/new")}
          >
            Add Client
          </Button>
        )}
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          label="Search by name..."
          variant="outlined"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />
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
                  Last Name
                </TableSortLabel>
              </TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="info"
                    onClick={() => navigate(`/clients/${client.id}`)}
                  >
                    <ViewIcon />
                  </IconButton>
                  {canManage && (
                    <>
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/clients/edit/${client.id}`)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(client.id)}
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
          labelRowsPerPage="Rows per page:"
        />
      </TableContainer>
    </Container>
  );
};

export default ClientList;
