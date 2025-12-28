import React, { useState } from 'react';
import { Button, Typography, Box } from '@mui/material';

const KitchenStaffDashboard = () => {
  const orders = [
    {
      orderId: "#001",
      table: "Table 4",
      items: "2x Veggi Burger, 1x Apple Pie",
      status: "Order Received",
    },
    {
      orderId: "#002",
      table: "Takeout",
      items: "1x Spring Roan, 1x Garlic Naan, 1x Tikka Masala",
      status: "Order Received",
    },
    {
      orderId: "#003",
      table: "Table 2",
      items: "1x Spring Naan, 1x Chicken Tikka Masala",
      status: "Order Received",
    },
  ];

  return (
    <Box
      sx={{
        backgroundImage: `url('src/assets/background-image.png')`, // Path to the background image in the public folder
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.7)', // Transparent white background for the dashboard
          borderRadius: '8px',
          padding: '20px',
          width: '400px',
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: '20px' }}>
          Kitchen Staff Dashboard
        </Typography>

        {/* List of orders */}
        {orders.map((order, index) => (
          <Box
            key={index}
            sx={{
              marginBottom: '20px',
              padding: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '8px',
              color: 'black'
            }}
          >
            <Typography variant="h6">Order {order.orderId} - {order.table}</Typography>
            <Typography variant="body2" sx={{ marginBottom: '10px' }}>
              {order.items}
            </Typography>
            <Button variant="contained" sx={{ marginRight: '10px' }}>
              {order.status}
            </Button>
            <Button variant="contained" color="primary" sx={{ marginRight: '10px' }}>
              Preparing
            </Button>
            <Button variant="contained" color="secondary">
              Ready to Pick
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default KitchenStaffDashboard;
