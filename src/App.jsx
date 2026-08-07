import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleGuard from "./routes/RoleGuard";

import Layout from "./components/Layout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AccessDenied from "./pages/AccessDenied";
import NotFound from "./pages/NotFound";
import ClientList from "./pages/ClientList";
import ClientDetails from "./pages/ClientDetails";
import ClientForm from "./pages/ClientForm";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import ProductForm from "./pages/ProductForm";
import OrderList from "./pages/OrderList";
import OrderDetails from "./pages/OrderDetails";
import OrderForm from "./pages/OrderForm";
import Users from "./pages/Users";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/access-denied" element={<AccessDenied />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/clients" element={<ClientList />} />
              <Route path="/clients/:id" element={<ClientDetails />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/orders" element={<OrderList />} />
              <Route path="/orders/:id" element={<OrderDetails />} />

              <Route
                element={<RoleGuard allowedRoles={["ADMIN", "MANAGER"]} />}
              >
                <Route path="/clients/new" element={<ClientForm />} />
                <Route path="/clients/edit/:id" element={<ClientForm />} />
                <Route path="/products/new" element={<ProductForm />} />
                <Route path="/products/edit/:id" element={<ProductForm />} />
                <Route path="/orders/new" element={<OrderForm />} />
              </Route>

              <Route element={<RoleGuard allowedRoles={["ADMIN"]} />}>
                <Route path="/users" element={<Users />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
