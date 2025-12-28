
import React, { useState } from 'react';
import { 
  Checkbox, 
  Button, 
  Typography, 
  Box, 
  FormControlLabel,
  Paper,
  Divider,
  Badge,
  LinearProgress
} from '@mui/material';
import FeedbackIcon from '@mui/icons-material/Feedback';
import HistoryIcon from '@mui/icons-material/History';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useNavigate } from 'react-router'; // Import for navigation
import CustomerMenuData from '../../components/customerComponents/CustomerMenuData';

const MenuPage = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [orderStatus, setOrderStatus] = useState('Not Ordered Yet');
  const navigate = useNavigate(); // Initialize navigate hook

  const menuItems = [
    { name: 'Appetizers', price: 8.99 },
    { name: 'Spring Roan', price: 8.99 },
    { name: 'Garlic Naan', price: 8.99 },
    { name: 'Caprese', price: 2.99 },
    { name: 'Caprese Salad', price: 2.99 },
    { name: 'Chicken Tikka Masala', price: 3.99 },
    { name: 'Veggi Burger', price: 8.99 },
    { name: 'Grilled Saimarva', price: 2.99 },
    { name: 'Chocolate Lava Cake', price: 3.99 },
    { name: 'Ice Cream Trio', price: 3.09 },
    { name: 'Apple Pie', price: 3.99 },
  ];

  const handleChange = (item) => {
    setSelectedItems((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, itemName) => {
      const item = menuItems.find(menuItem => menuItem.name === itemName);
      return total + (item ? item.price : 0);
    }, 0).toFixed(2);
  };

  const handlePlaceOrder = () => {
    setOrderStatus('Order Placed');
    setTimeout(() => setOrderStatus('Preparing'), 1000);
    setTimeout(() => setOrderStatus('Cooking'), 3000);
    setTimeout(() => setOrderStatus('Ready to Serve'), 5000);
    setTimeout(() => setOrderStatus('Served'), 7000);
  };

  const getStatusProgress = () => {
    switch(orderStatus) {
      case 'Not Ordered Yet': return 0;
      case 'Order Placed': return 25;
      case 'Preparing': return 40;
      case 'Cooking': return 65;
      case 'Ready to Serve': return 85;
      case 'Served': return 100;
      default: return 0;
    }
  };

  const getStatusColor = () => {
    switch(orderStatus) {
      case 'Order Placed': return '#FF6B6B';
      case 'Preparing': return '#FFA726';
      case 'Cooking': return '#29B6F6';
      case 'Ready to Serve': return '#66BB6A';
      case 'Served': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: `url('src/assets/background-image.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        padding: '20px',
        position: 'relative',
      }}
    >
      {/* Top Left: Give Feedback Button */}
      <Button
        variant="contained"
        startIcon={<FeedbackIcon />}
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          backgroundColor: '#FF6B6B',
          '&:hover': {
            backgroundColor: '#FF5252',
          },
        }}
        onClick={() => navigate('/feedback')} // Navigate to feedback page
      >
        Give Feedback
      </Button>

      {/* Top Right: Order History and Make Reservation */}
      <Box sx={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: 2 }}>
        {/* Order History Button */}
        <Button
          variant="contained"
          startIcon={<HistoryIcon />}
          sx={{
            backgroundColor: '#FF9800',
            '&:hover': {
              backgroundColor: '#F57C00',
            },
          }}
        >
          Order History
        </Button>

        {/* Make Reservation Button */}
        <Button
          variant="contained"
          startIcon={<RestaurantIcon />}
          sx={{
            backgroundColor: '#45B7D1',
            '&:hover': {
              backgroundColor: '#3AA3C4',
            },
          }}
          onClick={() => navigate('/reservation')} // Navigate to reservation page
        >
          Make Reservation
        </Button>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ display: 'flex', gap: 4, width: '100%', maxWidth: '1200px', alignItems: 'flex-start' }}>
        {/* Order Status Box - Left of Menu (Half width of menu) */}
        <Paper
          elevation={6}
          sx={{
            width: '200px', // Half of menu width (400px)
            padding: '15px',
            backgroundColor: 'rgba(0, 0, 0, 0.85)', // Black background
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            color: 'white',
            minHeight: '400px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ReceiptIcon sx={{ color: '#4CAF50', mr: 1 }} />
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>
              Order Status
            </Typography>
          </Box>
          
          <Divider sx={{ backgroundColor: '#444', mb: 3 }} />
          
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Badge
              color="primary"
              variant="dot"
              sx={{ mb: 2 }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: getStatusColor(),
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                }}
              >
                {orderStatus}
              </Typography>
            </Badge>
          </Box>

          {/* Progress Bar */}
          <Box sx={{ width: '100%', mb: 3 }}>
            <LinearProgress 
              variant="determinate" 
              value={getStatusProgress()} 
              sx={{ 
                height: 10, 
                borderRadius: 5,
                backgroundColor: '#333',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getStatusColor(),
                }
              }} 
            />
            <Typography variant="caption" sx={{ color: '#aaa', fontSize: '0.75rem', mt: 1, display: 'block', textAlign: 'center' }}>
              {getStatusProgress()}% Complete
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ color: '#ccc', textAlign: 'center', fontSize: '0.85rem' }}>
            {orderStatus === 'Not Ordered Yet' && 'Select items and click "Place Order"'}
            {orderStatus === 'Order Placed' && 'Your order has been received'}
            {orderStatus === 'Preparing' && 'Chef is preparing your ingredients'}
            {orderStatus === 'Cooking' && 'Your food is being cooked'}
            {orderStatus === 'Ready to Serve' && 'Your order is ready to serve'}
            {orderStatus === 'Served' && 'Enjoy your meal!'}
          </Typography>
        </Paper>

        {/* Menu Box - Center (Main Menu) */}
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '12px',
            padding: '25px',
            // width: '400px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          <Typography variant="h5" sx={{ 
            marginBottom: '20px', 
            color: '#2C3E50',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            🍽️ Restaurant Menu
          </Typography>

          <CustomerMenuData/>

          <Divider sx={{ my: 2 }} />

          {/* Order Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handlePlaceOrder}
            disabled={selectedItems.length === 0}
            sx={{ 
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 'bold',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
              }
            }}
          >
            Place Order ({selectedItems.length} items)
          </Button>
        </Box>

        {/* Right Panel - Total Bill and Pay Bill (Half width of menu) */}
        <Paper
          elevation={6}
          sx={{
            width: '200px', // Half of menu width (400px)
            padding: '15px',
            backgroundColor: 'rgba(0, 0, 0, 0.85)', // Black background
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            color: 'white',
            minHeight: '400px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PaymentIcon sx={{ color: '#FFD700', mr: 1 }} />
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>
              Bill Summary
            </Typography>
          </Box>
          
          <Divider sx={{ backgroundColor: '#444', mb: 3 }} />
          
          {/* Selected Items List */}
          <Box sx={{ 
            flexGrow: 1, 
            mb: 3, 
            maxHeight: '250px', 
            overflowY: 'auto',
            pr: 1,
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#333',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#666',
              borderRadius: '10px',
            },
          }}>
            {selectedItems.length === 0 ? (
              <Typography sx={{ color: '#aaa', textAlign: 'center', fontSize: '0.85rem' }}>
                No items selected
              </Typography>
            ) : (
              selectedItems.map((itemName, index) => {
                const item = menuItems.find(menuItem => menuItem.name === itemName);
                return (
                  <Box key={index} sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    mb: 1.5,
                    alignItems: 'center'
                  }}>
                    <Typography sx={{ fontSize: '0.85rem', color: '#fff' }}>
                      {item.name}
                    </Typography>
                    <Typography sx={{ 
                      fontSize: '0.85rem', 
                      color: '#4CAF50',
                      fontWeight: 'bold'
                    }}>
                      ${item.price.toFixed(2)}
                    </Typography>
                  </Box>
                );
              })
            )}
          </Box>

          <Divider sx={{ backgroundColor: '#444', my: 2 }} />

          {/* Total Bill */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 3,
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: '12px',
            borderRadius: '8px'
          }}>
            <Typography variant="h6" sx={{ color: '#fff', fontSize: '1rem' }}>
              Total:
            </Typography>
            <Typography variant="h5" sx={{ 
              color: '#FFD700', 
              fontWeight: 'bold',
              fontSize: '1.4rem'
            }}>
              ${calculateTotal()}
            </Typography>
          </Box>

          {/* Pay Bill Button */}
          <Button
            variant="contained"
            color="success"
            fullWidth
            startIcon={<PaymentIcon />}
            disabled={selectedItems.length === 0}
            sx={{
              py: 1.5,
              fontSize: '0.95rem',
              backgroundColor: '#4CAF50',
              borderRadius: '8px',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#388E3C',
                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
              },
              '&.Mui-disabled': {
                backgroundColor: '#2E7D32',
                color: 'rgba(255,255,255,0.5)',
              }
            }}
          >
            Pay Bill
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default MenuPage;