
import React, { useState } from "react";
import {
  Button,
  Typography,
  Box,
  TextField,
  IconButton,
  Modal,
  Grid,
  Paper,
  Card,
  CardContent,
  Divider,
  Chip,
  Avatar,
  Badge,
  Stack,
} from "@mui/material";
import { 
  Delete, 
  Edit, 
  Add, 
  Fastfood, 
  Restaurant, 
  LocalBar, 
  Cake, 
  Feedback, 
  Star, 
  Person, 
  TableBar,
  AccessTime,
  CheckCircle,
  Pending,
  Cancel
} from "@mui/icons-material";
import MenuData from "../../components/adminComponents/MenuData";

const Admin = () => {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [menuData, setMenuData] = useState([
    {
      id: 1,
      name: "Traditional",
      icon: <Restaurant />,
      color: "#FF6B6B",
      items: [
        { name: "Chicken Karahi", price: 12.99 },
        { name: "Beef Karahi", price: 14.99 },
        { name: "Chicken Biryani", price: 10.99 },
        { name: "Mutton Biryani", price: 13.99 },
      ],
    },
    {
      id: 2,
      name: "Fast Food",
      icon: <Fastfood />,
      color: "#45B7D1",
      items: [
        { name: "Burger & Chips", price: 8.99 },
        { name: "Chicken Wings", price: 9.99 },
        { name: "Pizza", price: 11.99 },
        { name: "French Fries", price: 3.99 },
      ],
    },
    {
      id: 3,
      name: "Drinks",
      icon: <LocalBar />,
      color: "#96CEB4",
      items: [
        { name: "Coca Cola", price: 1.99 },
        { name: "Sprite", price: 1.99 },
        { name: "Orange Juice", price: 3.49 },
        { name: "Lemonade", price: 2.99 },
      ],
    },
    {
      id: 4,
      name: "Desserts",
      icon: <Cake />,
      color: "#FFD166",
      items: [
        { name: "Chocolate Lava", price: 6.99 },
        { name: "Ice Cream", price: 4.99 },
        { name: "Apple Pie", price: 5.99 },
        { name: "Cheesecake", price: 7.49 },
      ],
    },
  ]);

  const [currentMenu, setCurrentMenu] = useState(null);
  const [menuName, setMenuName] = useState("");
  const [items, setItems] = useState([{ name: "", price: "" }]);
  const [openModal, setOpenModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);


  const reservations = [
    { id: 1, customer: "John Doe", time: "7:00 PM", table: "T-12", guests: 4, status: "confirmed" },
    { id: 2, customer: "Jane Smith", time: "7:30 PM", table: "T-05", guests: 2, status: "pending" },
    { id: 3, customer: "Mike Johnson", time: "8:00 PM", table: "T-08", guests: 6, status: "confirmed" },
    { id: 4, customer: "Sarah Wilson", time: "8:30 PM", table: "T-03", guests: 3, status: "cancelled" },
    { id: 5, customer: "David Brown", time: "9:00 PM", table: "T-15", guests: 5, status: "confirmed" },
  ];

  const feedbacks = [
    { id: 1, customer: "John Doe", rating: 5, comment: "Excellent food and service!", date: "2024-01-15" },
    { id: 2, customer: "Jane Smith", rating: 4, comment: "Good experience but waiting time was long", date: "2024-01-14" },
    { id: 3, customer: "Mike Johnson", rating: 5, comment: "Best restaurant in town!", date: "2024-01-13" },
    { id: 4, customer: "Sarah Wilson", rating: 3, comment: "Food was good but too expensive", date: "2024-01-12" },
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case "confirmed": return <CheckCircle sx={{ color: "#4CAF50", fontSize: 16 }} />;
      case "pending": return <Pending sx={{ color: "#FF9800", fontSize: 16 }} />;
      case "cancelled": return <Cancel sx={{ color: "#F44336", fontSize: 16 }} />;
      default: return <CheckCircle sx={{ color: "#4CAF50", fontSize: 16 }} />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "confirmed": return "#4CAF50";
      case "pending": return "#FF9800";
      case "cancelled": return "#F44336";
      default: return "#4CAF50";
    }
  };

  // Handle Modal Open for Edit or Create
  const handleOpenModal = (menu = null) => {
    if (menu) {
      setCurrentMenu(menu);
      setMenuName(menu.name);
      setItems(menu.items);
    } else {
      setCurrentMenu(null);
      setMenuName("");
      setItems([{ name: "", price: "" }]);
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  // Handle Save: Add/Edit Menu and Items
  const handleSave = () => {
    if (currentMenu) {
      // Edit menu
      setMenuData(
        menuData.map((menu) =>
          menu.id === currentMenu.id
            ? { ...menu, name: menuName, items: items }
            : menu
        )
      );
    } else {
      // Add new menu
      const newId = menuData.length + 1;
      setMenuData([...menuData, { 
        id: newId, 
        name: menuName, 
        icon: <Fastfood />,
        color: "#45B7D1",
        items: items 
      }]);
    }
    setOpenModal(false);
  };

  // Add new item in the modal
  const handleAddItem = () => {
    setItems([...items, { name: "", price: "" }]);
  };

  // Remove an item from the modal
  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  // Handle item name/price changes in the modal
  const handleItemChange = (index, field, value) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setItems(updatedItems);
  };

  // Get selected category

  const averageRating = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0) / feedbacks.length;

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh",
        padding: 3,
      }}
    >
      <Box
        sx={{
          maxWidth: "1400px",
          margin: "0 auto",
          height: "90vh",
        }}
      >
        {/* Header with Feedback Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" sx={{ color: "white", fontWeight: "bold" }}>
            🍽️ Restaurant Admin Dashboard
          </Typography>

          <Badge badgeContent={feedbacks.length} color="error">
            <Button
              variant="contained"
              startIcon={<Feedback />}
              sx={{
                background: "linear-gradient(to right, #FF9800, #FFB74D)",
                borderRadius: 3,
                fontWeight: "bold",
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                boxShadow: "0 4px 15px rgba(255, 152, 0, 0.3)",
                "&:hover": {
                  background: "linear-gradient(to right, #F57C00, #FFA726)",
                  boxShadow: "0 6px 20px rgba(255, 152, 0, 0.4)",
                },
              }}
            >
              View Feedbacks
            </Button>
          </Badge>
        </Box>

        <Grid container spacing={3}>
          {/* Left Column - Reservations */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={8}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: 3,
                padding: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", color: "#2C3E50" }}
                >
                  Today's Reservations
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#45B7D1", fontWeight: "bold" }}
                >
                  {reservations.length} Total
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Stack spacing={2} sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
                {reservations.map((reservation) => (
                  <Paper
                    key={reservation.id}
                    sx={{
                      padding: 2,
                      borderRadius: 2,
                      borderLeft: `4px solid ${getStatusColor(
                        reservation.status
                      )}`,
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold", color: "#2C3E50" }}
                        >
                          {reservation.customer}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mt: 0.5,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <AccessTime sx={{ fontSize: 16, color: "#666" }} />
                            <Typography
                              variant="caption"
                              sx={{ color: "#666" }}
                            >
                              {reservation.time}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <TableBar sx={{ fontSize: 16, color: "#666" }} />
                            <Typography
                              variant="caption"
                              sx={{ color: "#666" }}
                            >
                              {reservation.table}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <Person sx={{ fontSize: 16, color: "#666" }} />
                            <Typography
                              variant="caption"
                              sx={{ color: "#666" }}
                            >
                              {reservation.guests}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      {getStatusIcon(reservation.status)}
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Center Column - Menu Management */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={8}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: 3,
                padding: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Menu Header with Actions */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Box>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", color: "#2C3E50", mb: 0.5 }}
                  >
                    Menu Management
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    Manage your restaurant menu categories and items
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenModal()}
                    sx={{
                      background: "linear-gradient(to right, #FF6B6B, #FF8E53)",
                      borderRadius: 2,
                      fontWeight: "bold",
                      px: 3,
                      "&:hover": {
                        background:
                          "linear-gradient(to right, #FF5252, #FF7B3A)",
                      },
                    }}
                  >
                    Add Category
                  </Button>
                </Box>
              </Box>
              {/* Menu Items Data */}
              <MenuData
               open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
              />

              {/* Action Buttons */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 3,
                  pt: 2,
                  borderTop: "1px solid #eee",
                }}
              >
                {/* <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    Selected: {selectedMenu.name}
                  </Typography>
                  <Chip
                    label={`${selectedMenu.items.length} items`}
                    size="small"
                    sx={{ backgroundColor: selectedMenu.color, color: "white" }}
                  />
                </Box> */}

                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    // onClick={() => handleOpenModal(selectedMenu)}
                    onClick={() => setEditModalOpen(true)}
                    // sx={{
                    //   borderColor: selectedMenu.color,
                    //   color: selectedMenu.color,
                    //   borderRadius: 2,
                    //   fontWeight: "bold",
                    //   "&:hover": {
                    //     borderColor: selectedMenu.color,
                    //     backgroundColor: `${selectedMenu.color}10`,
                    //   },
                    // }}
                  >
                    Edit Category
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Bottom Stats Row */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    borderRadius: 3,
                    height: "100%",
                  }}
                >
                  <CardContent>
                    <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                      42
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                      Active Orders
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      In progress
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    background:
                      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                    color: "white",
                    borderRadius: 3,
                    height: "100%",
                  }}
                >
                  <CardContent>
                    <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                      {
                        reservations.filter((r) => r.status === "confirmed")
                          .length
                      }
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                      Confirmed Reservations
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Today
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    background:
                      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                    color: "white",
                    borderRadius: 3,
                    height: "100%",
                  }}
                >
                  <CardContent>
                    <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                      {menuData.reduce(
                        (acc, menu) => acc + menu.items.length,
                        0
                      )}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                      Menu Items
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Total across all categories
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    background:
                      "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                    color: "white",
                    borderRadius: 3,
                    height: "100%",
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                        {averageRating.toFixed(1)}
                      </Typography>
                      <Star sx={{ color: "#FFD700", fontSize: 32 }} />
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                      Average Rating
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Based on {feedbacks.length} reviews
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      {/* Modal for Create/Edit Menu */}
     
    </Box>
  );
};

export default Admin;