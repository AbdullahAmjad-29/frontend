import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Button, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  MenuItem, Select
} from '@mui/material';
import { Refresh as RefreshIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import axios from 'axios';

const OrderDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const validStatuses = ['pending', 'preparing', 'ready', 'served'];

  useEffect(() => {
    fetchOrders();
    // // Set up real-time updates every 10 seconds
    // const interval = setInterval(fetchOrders, 1000000);
    // return () => clearInterval(interval);

  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:7001/api/orders/getAllOrders');
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.post(`http://localhost:7001/api/orders/updateOrder/${orderId}`, {
        status: newStatus
      });
      
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'warning';
      case 'preparing': return 'info';
      case 'ready': return 'success';
      case 'served': return 'secondary';
      default: return 'default';
    }
  };

  // Function to extract all items from the items object
  const getAllItems = (items) => {
    const allItems = [];
    Object.values(items).forEach(category => {
      category.forEach(item => {
        allItems.push(item.itemName);
      });
    });
    return allItems;
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
          📊 Order Management Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={fetchOrders} startIcon={<RefreshIcon />}>
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#e3f2fd' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {orders.length}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Total Orders
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#fff3e0' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {orders.filter(o => o.status === 'pending').length}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Pending
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#e8f5e9' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {orders.filter(o => o.status === 'ready').length}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Ready
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#f3e5f5' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              ${orders.reduce((sum, order) => sum + order.totalPrice, 0)}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Total Revenue
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Orders Table */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>All Orders</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Table</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">Loading...</TableCell>
                </TableRow>
              ) : orders.map(order => {
                const allItems = getAllItems(order.items);
                return (
                  <TableRow key={order._id} hover>
                    <TableCell>#{order._id.substring(order._id.length - 6)}</TableCell>
                    <TableCell>{order?.name}</TableCell>
                    <TableCell>
                      <Chip label={`Table ${order.tableNumber}`} size="small" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {allItems.slice(0, 2).join(', ')}
                        {allItems.length > 2 && ` +${allItems.length - 2} more`}
                      </Typography>
                    </TableCell>
                    <TableCell>Rs {order.totalPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <Select
                        size="small"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        sx={{ minWidth: 120 }}
                      >
                        {validStatuses.map(status => (
                          <MenuItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => setSelectedOrder(order)}>
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onClose={() => setSelectedOrder(null)} maxWidth="sm" fullWidth>
        {selectedOrder && (
          <>
            <DialogTitle>
              Order #{selectedOrder._id.substring(selectedOrder._id.length - 6)} Details
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">Table Number</Typography>
                <Typography variant="h6">Table {selectedOrder.tableNumber}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>Items</Typography>
                {Object.entries(selectedOrder.items).map(([category, items]) => (
                  <Box key={category} sx={{ mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {category}
                    </Typography>
                    {items.map((item, index) => (
                      <Typography key={index} variant="body2">
                        • {item.itemName} - Rs {item.itemPrice}
                      </Typography>
                    ))}
                  </Box>
                ))}
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">Total Amount</Typography>
                <Typography variant="h6">Rs {selectedOrder.totalPrice.toFixed(2)}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">Current Status</Typography>
                <Chip 
                  label={selectedOrder.status.toUpperCase()} 
                  color={getStatusColor(selectedOrder.status)}
                  sx={{ mt: 1 }}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedOrder(null)}>Close</Button>
              <Button variant="contained" onClick={() => {
                handleStatusChange(selectedOrder._id, 'served');
                setSelectedOrder(null);
              }}>
                Mark as Served
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default OrderDashboard;