import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  Alert,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  Divider,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  InputAdornment,
  Icon
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarningIcon from '@mui/icons-material/Warning';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router';

// Mock data for demonstration
const initialMockInventory = [
  { _id: 1, name: 'Tomatoes', quantity: 5, unit: 'kg', lowStockThreshold: 10, reorderPoint: 20, category: 'Vegetables' },
  { _id: 2, name: 'Chicken Breast', quantity: 8, unit: 'kg', lowStockThreshold: 15, reorderPoint: 30, category: 'Meat' },
  { _id: 3, name: 'Rice', quantity: 25, unit: 'kg', lowStockThreshold: 20, reorderPoint: 50, category: 'Grains' },
  { _id: 4, name: 'Onions', quantity: 12, unit: 'kg', lowStockThreshold: 10, reorderPoint: 25, category: 'Vegetables' },
  { _id: 5, name: 'Cooking Oil', quantity: 8, unit: 'L', lowStockThreshold: 5, reorderPoint: 15, category: 'Cooking Essentials' },
  { _id: 6, name: 'Flour', quantity: 15, unit: 'kg', lowStockThreshold: 20, reorderPoint: 40, category: 'Baking' },
  { _id: 7, name: 'Cheese', quantity: 6, unit: 'kg', lowStockThreshold: 10, reorderPoint: 20, category: 'Dairy' },
  { _id: 8, name: 'Potatoes', quantity: 20, unit: 'kg', lowStockThreshold: 15, reorderPoint: 30, category: 'Vegetables' },
];

const categories = ['Vegetables', 'Meat', 'Grains', 'Dairy', 'Baking', 'Cooking Essentials', 'Spices', 'Beverages'];
const units = ['kg', 'L', 'g', 'ml', 'pieces', 'packets', 'boxes'];

const InventoryTracker = () => {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState(initialMockInventory);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // State for Add/Edit functionality
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    name: '',
    quantity: 0,
    unit: 'kg',
    lowStockThreshold: 10,
    reorderPoint: 20,
    category: 'Vegetables'
  });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchInventoryData = async () => {
    setLoading(true);
    try {
      // For now, using mock data
      // Uncomment when backend is ready:
      // const [statusRes, lowStockRes] = await Promise.all([
      //   axios.get('/api/inventory/status'),
      //   axios.get('/api/inventory/low-stock')
      // ]);
      // setInventory(statusRes.data);
      // setLowStockItems(lowStockRes.data);
      
      // Using mock data
      const lowStock = inventory.filter(item => item.quantity <= item.lowStockThreshold);
      setLowStockItems(lowStock);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
    const interval = setInterval(fetchInventoryData, 30000);
    return () => clearInterval(interval);
  }, [inventory]);

  const handleRefresh = () => {
    fetchInventoryData();
  };

  // Add new item
  const handleAddItem = () => {
    setIsEditing(false);
    setCurrentItem({
      name: '',
      quantity: 0,
      unit: 'kg',
      lowStockThreshold: 10,
      reorderPoint: 20,
      category: 'Vegetables'
    });
    setOpenDialog(true);
  };

  // Edit existing item
  const handleEditItem = (item) => {
    setIsEditing(true);
    setCurrentItem({ ...item });
    setOpenDialog(true);
  };

  // Delete item
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setInventory(inventory.filter(item => item._id !== itemToDelete._id));
      setOpenDeleteDialog(false);
      setItemToDelete(null);
    }
  };

  // Save item (both add and edit)
  const handleSaveItem = () => {
    if (!currentItem.name.trim()) {
      alert('Please enter item name');
      return;
    }

    if (isEditing) {
      // Update existing item
      setInventory(inventory.map(item => 
        item._id === currentItem._id ? currentItem : item
      ));
    } else {
      // Add new item
      const newItem = {
        ...currentItem,
        _id: Math.max(...inventory.map(item => item._id)) + 1
      };
      setInventory([...inventory, newItem]);
    }
    
    setOpenDialog(false);
    setCurrentItem({
      name: '',
      quantity: 0,
      unit: 'kg',
      lowStockThreshold: 10,
      reorderPoint: 20,
      category: 'Vegetables'
    });
  };

  // Update quantity (deduct stock)
  const handleUpdateQuantity = (itemId, change) => {
    setInventory(inventory.map(item => {
      if (item._id === itemId) {
        const newQuantity = Math.max(0, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const getStockStatus = (item) => {
    if (item.quantity === 0) return { label: 'Out of Stock', color: 'error', bgColor: '#ffebee', icon: <ErrorIcon /> };
    if (item.quantity <= item.lowStockThreshold) return { label: 'Low Stock', color: 'warning', bgColor: '#fff3e0', icon: <WarningIcon /> };
    return { label: 'In Stock', color: 'success', bgColor: '#e8f5e9', icon: <CheckCircleIcon /> };
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Vegetables': return '#4caf50';
      case 'Meat': return '#f44336';
      case 'Grains': return '#ff9800';
      case 'Dairy': return '#2196f3';
      case 'Baking': return '#9c27b0';
      case 'Cooking Essentials': return '#607d8b';
      case 'Spices': return '#795548';
      case 'Beverages': return '#009688';
      default: return '#607d8b';
    }
  };

  const totalItems = inventory.length;
  const inStockItems = inventory.filter(i => i.quantity > 0).length;
  const outOfStockItems = inventory.filter(i => i.quantity === 0).length;
  const lowStockCount = lowStockItems.length;

  return (
    <Box sx={{ 
      p: 4, 
      bgcolor: '#f5f7fa', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Paper elevation={24} sx={{ 
        borderRadius: '20px', 
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <Box sx={{ 
          p: 3, 
          bgcolor: '#1a237e',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: '#4fc3f7', mr: 2, width: 56, height: 56 }}>
              <InventoryIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                Kitchen Inventory Tracker
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Real-time monitoring & management of all kitchen ingredients
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddItem}
              sx={{ 
                bgcolor: '#4caf50',
                '&:hover': { bgcolor: '#388e3c' }
              }}
            >
              Add New Item
            </Button>
            <Tooltip title="Refresh">
              <span>
                <IconButton
                  onClick={handleRefresh}
                  disabled={loading}
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ p: 3, bgcolor: '#f8f9fa' }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ 
              bgcolor: '#3f51b5', 
              color: 'white',
              borderRadius: '12px',
              height: '100%'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6">Total Items</Typography>
                    <Typography variant="h3">{totalItems}</Typography>
                  </Box>
                  <InventoryIcon sx={{ fontSize: 48, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ 
              bgcolor: lowStockCount > 0 ? '#ff9800' : '#4caf50', 
              color: 'white',
              borderRadius: '12px',
              height: '100%'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6">Low Stock</Typography>
                    <Typography variant="h3">{lowStockCount}</Typography>
                  </Box>
                  <WarningIcon sx={{ fontSize: 48, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ 
              bgcolor: outOfStockItems > 0 ? '#f44336' : '#00bcd4', 
              color: 'white',
              borderRadius: '12px',
              height: '100%'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6">Out of Stock</Typography>
                    <Typography variant="h3">{outOfStockItems}</Typography>
                  </Box>
                  <ErrorIcon sx={{ fontSize: 48, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content */}
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Left Column: Low Stock Alerts */}
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ 
                p: 3, 
                borderRadius: '16px',
                height: '100%'
              }}>
                <Typography variant="h6" sx={{ 
                  mb: 3, 
                  display: 'flex', 
                  alignItems: 'center',
                  color: '#d32f2f'
                }}>
                  <WarningIcon sx={{ mr: 1 }} /> Low Stock Alerts
                </Typography>
                
                {lowStockItems.length > 0 ? (
                  <Box>
                    {lowStockItems.map(item => (
                      <Box key={item._id} sx={{ 
                        mb: 2, 
                        p: 2, 
                        borderRadius: '8px',
                        bgcolor: '#ffebee',
                        borderLeft: '4px solid #f44336'
                      }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {item.name}
                          </Typography>
                          <Chip 
                            label={`${item.quantity} ${item.unit}`} 
                            size="small" 
                            color="error"
                          />
                        </Box>
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                          Threshold: {item.lowStockThreshold} {item.unit}
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={(item.quantity / item.reorderPoint) * 100}
                          sx={{ 
                            mt: 1, 
                            height: 6, 
                            borderRadius: 3,
                            '& .MuiLinearProgress-bar': {
                              bgcolor: '#f44336'
                            }
                          }}
                        />
                        <Button 
                          size="small" 
                          startIcon={<LocalShippingIcon />}
                          sx={{ mt: 1 }}
                          onClick={() => {
                            handleEditItem(item);
                          }}
                        >
                          Update Stock
                        </Button>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Box sx={{ 
                    p: 4, 
                    textAlign: 'center',
                    bgcolor: '#e8f5e9',
                    borderRadius: '8px'
                  }}>
                    <CheckCircleIcon sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
                    <Typography variant="h6" color="#4caf50">
                      All items are well-stocked!
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* Right Column: Inventory Table */}
            <Grid item xs={12} md={8}>
              <Paper elevation={2} sx={{ 
                p: 3, 
                borderRadius: '16px',
                height: '100%'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                    <RestaurantIcon sx={{ mr: 1 }} /> All Inventory Items
                  </Typography>
                  <Chip 
                    icon={<RefreshIcon />}
                    label="Live Updates"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
                
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                        <TableCell><Typography variant="subtitle2" fontWeight="bold">Item</Typography></TableCell>
                        <TableCell><Typography variant="subtitle2" fontWeight="bold">Category</Typography></TableCell>
                        <TableCell><Typography variant="subtitle2" fontWeight="bold">Current Stock</Typography></TableCell>
                        <TableCell><Typography variant="subtitle2" fontWeight="bold">Threshold</Typography></TableCell>
                        <TableCell><Typography variant="subtitle2" fontWeight="bold">Status</Typography></TableCell>
                        <TableCell><Typography variant="subtitle2" fontWeight="bold">Actions</Typography></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {inventory.map((item) => {
                        const status = getStockStatus(item);
                        const progress = (item.quantity / item.reorderPoint) * 100;
                        
                        return (
                          <TableRow 
                            key={item._id} 
                            hover
                            sx={{ 
                              '&:hover': { bgcolor: status.bgColor },
                              borderLeft: `4px solid ${getCategoryColor(item.category)}`
                            }}
                          >
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ 
                                  bgcolor: getCategoryColor(item.category), 
                                  mr: 2,
                                  width: 32,
                                  height: 32
                                }}>
                                  {item.name.charAt(0)}
                                </Avatar>
                                <Box>
                                  <Typography fontWeight="bold">{item.name}</Typography>
                                  <Typography variant="caption" color="textSecondary">
                                    {item.unit}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={item.category}
                                size="small"
                                sx={{ 
                                  bgcolor: getCategoryColor(item.category) + '20',
                                  color: getCategoryColor(item.category)
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleUpdateQuantity(item._id, -1)}
                                  sx={{ 
                                    bgcolor: '#ffebee',
                                    color: '#f44336',
                                    '&:hover': { bgcolor: '#ffcdd2' }
                                  }}
                                >
                                  -
                                </IconButton>
                                <Typography variant="h6" color={
                                  item.quantity === 0 ? 'error' : 
                                  item.quantity <= item.lowStockThreshold ? 'warning.main' : 
                                  'success.main'
                                }>
                                  {item.quantity}
                                </Typography>
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleUpdateQuantity(item._id, 1)}
                                  sx={{ 
                                    bgcolor: '#e8f5e9',
                                    color: '#4caf50',
                                    '&:hover': { bgcolor: '#c8e6c9' }
                                  }}
                                >
                                  +
                                </IconButton>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography color="textSecondary">
                                {item.lowStockThreshold} {item.unit}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {status.icon}
                                <Typography sx={{ ml: 1 }}>{status.label}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title="Edit">
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleEditItem(item)}
                                    sx={{ 
                                      bgcolor: '#e3f2fd',
                                      color: '#2196f3',
                                      '&:hover': { bgcolor: '#bbdefb' }
                                    }}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleDeleteClick(item)}
                                    sx={{ 
                                      bgcolor: '#ffebee',
                                      color: '#f44336',
                                      '&:hover': { bgcolor: '#ffcdd2' }
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>

          {/* Footer */}
          <Box sx={{ 
            mt: 3, 
            p: 2, 
            bgcolor: '#f8f9fa', 
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="caption" color="textSecondary">
              Last updated: {lastUpdated.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
              })}
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/customer')}
              sx={{ borderRadius: '20px' }}
            >
              Back to Menu
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Add/Edit Item Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditing ? 'Edit Inventory Item' : 'Add New Inventory Item'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Item Name"
              fullWidth
              value={currentItem.name}
              onChange={(e) => setCurrentItem({...currentItem, name: e.target.value})}
              required
            />
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Quantity"
                  type="number"
                  fullWidth
                  value={currentItem.quantity}
                  onChange={(e) => setCurrentItem({...currentItem, quantity: parseInt(e.target.value) || 0})}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">{currentItem.unit}</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  label="Unit"
                  fullWidth
                  value={currentItem.unit}
                  onChange={(e) => setCurrentItem({...currentItem, unit: e.target.value})}
                >
                  {units.map(unit => (
                    <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Low Stock Threshold"
                  type="number"
                  fullWidth
                  value={currentItem.lowStockThreshold}
                  onChange={(e) => setCurrentItem({...currentItem, lowStockThreshold: parseInt(e.target.value) || 0})}
                  helperText="Alert when stock reaches this level"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Reorder Point"
                  type="number"
                  fullWidth
                  value={currentItem.reorderPoint}
                  onChange={(e) => setCurrentItem({...currentItem, reorderPoint: parseInt(e.target.value) || 0})}
                  helperText="Recommended reorder quantity"
                />
              </Grid>
            </Grid>

            <TextField
              select
              label="Category"
              fullWidth
              value={currentItem.category}
              onChange={(e) => setCurrentItem({...currentItem, category: e.target.value})}
            >
              {categories.map(category => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSaveItem} 
            startIcon={<SaveIcon />}
          >
            {isEditing ? 'Update Item' : 'Add Item'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{itemToDelete?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleConfirmDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InventoryTracker;