import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Box,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const drawerWidth = 240;

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const menuItems = [
    {
      text: "Dashboard",
      path: "/dashboard",
      roles: ["ADMIN", "MANAGER", "AGENT"],
    },
    { text: "Clients", path: "/clients", roles: ["ADMIN", "MANAGER", "AGENT"] },
    {
      text: "Products",
      path: "/products",
      roles: ["ADMIN", "MANAGER", "AGENT"],
    },
    { text: "Orders", path: "/orders", roles: ["ADMIN", "MANAGER", "AGENT"] },
    { text: "Users", path: "/users", roles: ["ADMIN"] },
    { text: "API Documentation", path: "/api-docs", roles: ["ADMIN"] },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          {menuItems.map((item) => {
            if (item.roles.includes(user.role)) {
              const isSelected = location.pathname.startsWith(item.path);
              return (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    selected={isSelected}
                  >
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              );
            }
            return null;
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
