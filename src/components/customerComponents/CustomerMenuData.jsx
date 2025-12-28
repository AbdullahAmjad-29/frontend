import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Stack, Chip, Grid, Paper, Typography } from '@mui/material';
import { RiceBowl, LocalBar, Fastfood } from '@mui/icons-material'; // Example icons

const CustomerMenuData = () => {
  const [menuData, setMenuData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  // Map API categories to icons
  const getIcon = (categoryName) => {
    const iconMap = {
      'rice': <RiceBowl />,
      'Drinkss': <LocalBar />,
      'fast food menu': <Fastfood />,
      // Add more mappings as needed
    };
    return iconMap[categoryName] || <Fastfood />;
  };

  // Map API categories to colors
  const getColor = (categoryName) => {
    const colorMap = {
      'rice': '#4CAF50',
      'Drinkss': '#2196F3',
      'fast food menu': '#FF5722',
    };
    return colorMap[categoryName] || '#757575';
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await axios.get('http://localhost:7001/api/menu/getAllMenus');
      if (response.data.success) {
        const formattedData = response.data.data.map(menu => ({
          id: menu._id,
          name: menu.categoryName,
          icon: getIcon(menu.categoryName),
          color: getColor(menu.categoryName),
          items: menu.menuItems.map(item => ({
            name: item.itemName,
            price: item.itemPrice,
            id: item._id
          }))
        }));
        setMenuData(formattedData);
        if (formattedData.length > 0) {
          setSelectedCategory(formattedData[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching menus:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedMenu = menuData.find(menu => menu.id === selectedCategory) || { items: [] };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <>
      {/* Category Tabs */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          {menuData.map((menu) => (
            <Chip
              key={menu.id}
              icon={menu.icon}
              label={menu.name}
              onClick={() => setSelectedCategory(menu.id)}
              sx={{
                backgroundColor: selectedCategory === menu.id ? menu.color : "#e0e0e0",
                color: selectedCategory === menu.id ? "white" : "#666",
                fontWeight: "bold",
                padding: "8px 16px",
                mb: 1,
                '&:hover': {
                  backgroundColor: selectedCategory === menu.id ? menu.color : "#d5d5d5",
                  opacity: 0.9,
                }
              }}
            />
          ))}
        </Stack>
      </Box>

      {/* Menu Items Grid */}
      <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
        <Grid container spacing={2}>
          {selectedMenu.items.map((item) => (
            <Grid item xs={12} sm={6} key={item.id}>
              <Paper
                sx={{
                  padding: 2.5,
                  borderRadius: 2,
                  borderLeft: `4px solid ${selectedMenu.color}`,
                  backgroundColor: "#f9f9f9",
                  height: "100%",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  '&:hover': {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
                  }
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#2C3E50" }}>
                    {item.name}
                  </Typography>
                  <Typography variant="h6" sx={{ color: "#2E7D32", fontWeight: "bold" }}>
                    ${item.price}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default CustomerMenuData;