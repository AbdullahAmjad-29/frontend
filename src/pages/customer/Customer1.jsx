import React, { useState, useEffect } from "react";
import {
  Checkbox,
  Button,
  Typography,
  Box,
  FormControlLabel,
  Paper,
  Divider,
  Badge,
  LinearProgress,
  IconButton,
  Chip,
} from "@mui/material";
import FeedbackIcon from "@mui/icons-material/Feedback";
import HistoryIcon from "@mui/icons-material/History";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import PaymentIcon from "@mui/icons-material/Payment";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router";
import axios from "axios";

const MenuPage = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [orderStatus, setOrderStatus] = useState("Not Ordered Yet");
  const [menuData, setMenuData] = useState([]);
  const [tableNumber, setTableNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState();
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const storedName = localStorage.getItem("name")?.replace(/"/g, "").trim();

  // Fetch menu data
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(
          "http://localhost:7001/api/menu/getAllMenus",
        );
        const data = await response.json();
        setMenuData(data.data || []);
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };
    fetchMenu();
  }, []);

  // Add item to order
  const handleAddItem = (categoryName, item) => {
    setSelectedItems((prev) => {
      const existingItem = prev.find(
        (i) => i.itemName === item.itemName && i.category === categoryName,
      );

      if (existingItem) {
        return prev.map((i) =>
          i.itemName === item.itemName && i.category === categoryName
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      } else {
        return [
          ...prev,
          {
            itemName: item.itemName,
            itemPrice: item.itemPrice,
            category: categoryName,
            quantity: 1,
            _id: item._id,
          },
        ];
      }
    });
  };

  // Remove one quantity of item
  const handleRemoveItem = (itemName, category) => {
    setSelectedItems((prev) => {
      const existingItem = prev.find(
        (i) => i.itemName === itemName && i.category === category,
      );

      if (existingItem.quantity > 1) {
        return prev.map((i) =>
          i.itemName === itemName && i.category === category
            ? { ...i, quantity: i.quantity - 1 }
            : i,
        );
      } else {
        return prev.filter(
          (i) => !(i.itemName === itemName && i.category === category),
        );
      }
    });
  };

  // Remove entire item from order
  const handleDeleteItem = (itemName, category) => {
    setSelectedItems((prev) =>
      prev.filter((i) => !(i.itemName === itemName && i.category === category)),
    );
  };

  // Calculate total
  const calculateTotal = () => {
    return selectedItems.reduce(
      (total, item) => total + item.itemPrice * item.quantity,
      0,
    );
  };

  // Create order API call
  const handleCreateOrder = async () => {
    if (selectedItems.length === 0) return;

    try {
      setLoading(true);

      // Structure items by category as per API requirement
      const itemsByCategory = {};

      selectedItems.forEach((item) => {
        if (!itemsByCategory[item.category]) {
          itemsByCategory[item.category] = [];
        }
        // Add the item quantity times
        for (let i = 0; i < item.quantity; i++) {
          itemsByCategory[item.category].push({
            itemName: item.itemName,
            itemPrice: item.itemPrice,
          });
        }
      });

      const orderData = {
        name: name,
        tableNumber: tableNumber,
        items: itemsByCategory,
        totalPrice: calculateTotal(),
      };

      console.log("Sending order:", orderData);

      const response = await fetch(
        "http://localhost:7001/api/orders/createOrder",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        },
      );
       if (response.ok) {
        const result = await response.json();
        console.log('Order created successfully:', result);
        
        setSelectedItems([]);
        window.location.reload();
      } else {
        console.error('Failed to create order');
      }

    } catch (error) {
      console.error("Error creating order:", error);
    } finally {
      setLoading(false);
    }
  };


  const logoutfn = () => {
    localStorage.clear();
    navigate("/");
  };

  // All orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:7001/api/orders/getAllOrders",
      );
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  const filterOrderOfCustomer = orders?.filter((order) => {
    if (!order?.name || !storedName) return false;

    return order?.name.replace(/"/g, "").trim() === storedName;
  });
  return (
    <Box
      sx={{
        backgroundImage: `url('src/assets/background-image.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        padding: "20px",
        position: "relative",
      }}
    >
      {/* Top Left: Give Feedback Button */}
      <Button
        variant="contained"
        startIcon={<FeedbackIcon />}
        sx={{
          position: "absolute",
          top: 20,
          left: 20,
          backgroundColor: "#FF6B6B",
          "&:hover": {
            backgroundColor: "#FF5252",
          },
        }}
        onClick={() => navigate("/feedback")}
      >
        Give Feedback
      </Button>

      {/* Top Right: Order History, Make Reservation, and Logout */}
      <Box
        sx={{
          position: "absolute",
          top: 20,
          right: 20,
          display: "flex",
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          startIcon={<HistoryIcon />}
          sx={{
            backgroundColor: "#FF9800",
            "&:hover": {
              backgroundColor: "#F57C00",
            },
          }}
        >
          Order History
        </Button>

        <Button
          variant="contained"
          startIcon={<RestaurantIcon />}
          sx={{
            backgroundColor: "#45B7D1",
            "&:hover": {
              backgroundColor: "#3AA3C4",
            },
          }}
          onClick={() => navigate("/reservation")}
        >
          Make Reservation
        </Button>

        <Button
          variant="contained"
          startIcon={<LogoutIcon />}
          sx={{
            backgroundColor: "#f44336",
            "&:hover": {
              backgroundColor: "#d32f2f",
            },
          }}
          onClick={logoutfn}
        >
          Logout
        </Button>
      </Box>

      {/* Main Content Area */}
      <Box
        sx={{
          display: "flex",
          gap: 4,
          width: "100%",
          maxWidth: "1200px",
          alignItems: "flex-start",
        }}
      >
        {/* Order Status Box - Left */}
<Paper
  elevation={8}
  sx={{
    width: 260,
    p: 2,
    background: "linear-gradient(180deg, #111, #1c1c1c)",
    borderRadius: 3,
    color: "white",
    minHeight: 420,
  }}
>
  {/* Header */}
  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
    <ReceiptIcon sx={{ color: "#4CAF50", mr: 1 }} />
    <Typography fontWeight="bold">Order Status</Typography>
  </Box>

  <Divider sx={{ mb: 2, bgcolor: "#333" }} />

  {/* Orders */}
  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
    {filterOrderOfCustomer?.map((order, index) => (
      <Paper
        key={order._id}
        elevation={3}
        sx={{
          p: 1.5,
          borderRadius: 2,
          backgroundColor: "#222",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography fontSize={13} color="#aaa">
            Order #{index + 1}
          </Typography>
        </Box>

        <Chip
          label={order.status}
          size="small"
          sx={{
            textTransform: "capitalize",
            bgcolor:
              order.status === "pending"
                ? "#ff9800"
                : order.status === "preparing"
                ? "#2196f3"
                : "#4caf50",
            color: "white",
            fontWeight: 500,
          }}
        />
      </Paper>
    ))}
  </Box>
</Paper>


        {/* Menu Box - Center */}
        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: "12px",
            padding: "25px",
            width: "400px",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              marginBottom: "20px",
              color: "#2C3E50",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            🍽️ Restaurant Menu
          </Typography>

          {/* Menu Display with Categories */}
          <Box sx={{ maxHeight: "400px", overflowY: "auto", pr: 1 }}>
            {menuData.map((category) => (
              <Box key={category._id} sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#34495E",
                    mb: 2,
                    pb: 1,
                    borderBottom: "2px solid #3498db",
                    fontSize: "1rem",
                  }}
                >
                  {category.categoryName}
                </Typography>

                {category.menuItems.map((item) => {
                  const isSelected = selectedItems.find(
                    (si) =>
                      si.itemName === item.itemName &&
                      si.category === category.categoryName,
                  );

                  return (
                    <Button
                      key={item._id}
                      fullWidth
                      variant={isSelected ? "contained" : "outlined"}
                      onClick={() => handleAddItem(category.categoryName, item)}
                      sx={{
                        mb: 1,
                        justifyContent: "space-between",
                        py: 1,
                        borderRadius: "8px",
                        backgroundColor: isSelected ? "#e3f2fd" : "transparent",
                        borderColor: isSelected ? "#1976d2" : "#ddd",
                        "&:hover": {
                          backgroundColor: isSelected ? "#bbdefb" : "#f5f5f5",
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.85rem",
                          textTransform: "none",
                          textAlign: "left",
                          flex: 1,
                        }}
                      >
                        {item.itemName}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.85rem",
                          fontWeight: "bold",
                          color: isSelected ? "#1976d2" : "#2c3e50",
                        }}
                      >
                        ${item.itemPrice}
                      </Typography>
                    </Button>
                  );
                })}
              </Box>
            ))}
          </Box>

          {/* Table Number Selection */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2, mt: 2 }}>
            <Typography sx={{ mr: 2, color: "#2C3E50", fontSize: "0.9rem" }}>
              Table:
            </Typography>
            <Box sx={{ display: "flex", gap: 0.5 }}>
              {[1, 2, 3, 4, 5].map((num) => (
                <Button
                  key={num}
                  variant={tableNumber === num ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setTableNumber(num)}
                  sx={{
                    minWidth: "30px",
                    height: "30px",
                    fontSize: "0.75rem",
                  }}
                >
                  {num}
                </Button>
              ))}
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />
        </Box>

        {/* Order Summary Box - Right */}
        <Paper
          elevation={6}
          sx={{
            width: "200px",
            padding: "15px",
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            borderRadius: "12px",
            display: "flex",
            flexDirection: "column",
            color: "white",
            minHeight: "400px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <PaymentIcon sx={{ color: "#FFD700", mr: 1 }} />
            <Typography variant="h6" sx={{ color: "#fff", fontWeight: "bold" }}>
              Order Summary
            </Typography>
          </Box>

          <Divider sx={{ backgroundColor: "#444", mb: 3 }} />

          {/* Selected Items List with Quantity Controls */}
          <Box
            sx={{
              flexGrow: 1,
              mb: 3,
              maxHeight: "250px",
              overflowY: "auto",
              pr: 1,
              "&::-webkit-scrollbar": {
                width: "4px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#333",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#666",
                borderRadius: "10px",
              },
            }}
          >
            {selectedItems.length === 0 ? (
              <Typography
                sx={{ color: "#aaa", textAlign: "center", fontSize: "0.85rem" }}
              >
                No items selected
              </Typography>
            ) : (
              selectedItems.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    mb: 2,
                    p: 1,
                    backgroundColor: "rgba(255,255,255,0.05)",
                    borderRadius: "6px",
                  }}
                >
                  {/* Item header row */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.8rem",
                        color: "#fff",
                        fontWeight: "bold",
                        lineHeight: 1.2,
                      }}
                    >
                      {item.itemName}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleDeleteItem(item.itemName, item.category)
                      }
                      sx={{ color: "#ff6b6b", p: 0.5, ml: 1 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  {/* Quantity controls and price row */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleRemoveItem(item.itemName, item.category)
                        }
                        sx={{
                          color: "#fff",
                          backgroundColor: "rgba(255,255,255,0.1)",
                          p: 0.5,
                          "&:hover": {
                            backgroundColor: "rgba(255,255,255,0.2)",
                          },
                        }}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>

                      <Typography
                        sx={{
                          fontSize: "0.85rem",
                          color: "#fff",
                          minWidth: "24px",
                          textAlign: "center",
                        }}
                      >
                        {item.quantity}
                      </Typography>

                      <IconButton
                        size="small"
                        onClick={() =>
                          handleAddItem(item.category, {
                            itemName: item.itemName,
                            itemPrice: item.itemPrice,
                            _id: item._id,
                          })
                        }
                        sx={{
                          color: "#fff",
                          backgroundColor: "rgba(255,255,255,0.1)",
                          p: 0.5,
                          "&:hover": {
                            backgroundColor: "rgba(255,255,255,0.2)",
                          },
                        }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Typography
                      sx={{
                        fontSize: "0.85rem",
                        color: "#4CAF50",
                        fontWeight: "bold",
                      }}
                    >
                      ${(item.itemPrice * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              ))
            )}
          </Box>

          <Divider sx={{ backgroundColor: "#444", my: 2 }} />

          {/* Total Bill */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              backgroundColor: "rgba(255,255,255,0.1)",
              padding: "12px",
              borderRadius: "8px",
            }}
          >
            <Typography variant="h6" sx={{ color: "#fff", fontSize: "1rem" }}>
              Total:
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: "#FFD700",
                fontWeight: "bold",
                fontSize: "1.4rem",
              }}
            >
              ${calculateTotal()}
            </Typography>
          </Box>

          {/* Create Order Button */}
          <Button
            variant="contained"
            color="success"
            fullWidth
            startIcon={<PaymentIcon />}
            disabled={selectedItems.length === 0 || loading}
            onClick={handleCreateOrder}
            sx={{
              py: 1,
              fontSize: "0.95rem",
              backgroundColor: "#4CAF50",
              borderRadius: "8px",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#388E3C",
                boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
              },
              "&.Mui-disabled": {
                backgroundColor: "#2E7D32",
                color: "rgba(255,255,255,0.5)",
              },
            }}
          >
            {loading ? "Creating Order..." : "Create Order"}
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default MenuPage;
