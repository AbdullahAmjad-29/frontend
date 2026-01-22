import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Box,
  Typography,
  Paper,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import { Add, Remove, Close, Restaurant } from '@mui/icons-material';

const API_BASE_URL = 'http://localhost:7001/api';

const CreateMenuDialog = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [categoryName, setCategoryName] = useState('');
  const [menuItems, setMenuItems] = useState([
    { itemName: '', itemPrice: '' }
  ]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setCategoryName('');
    setMenuItems([{ itemName: '', itemPrice: '' }]);
    setError('');
    setSuccess('');
  };

  const handleAddMenuItem = () => {
    setMenuItems([...menuItems, { itemName: '', itemPrice: '' }]);
  };

  const handleRemoveMenuItem = (index) => {
    if (menuItems.length > 1) {
      const updatedItems = [...menuItems];
      updatedItems.splice(index, 1);
      setMenuItems(updatedItems);
    }
  };

  const handleMenuItemChange = (index, field, value) => {
    const updatedItems = [...menuItems];
    if (field === 'itemPrice') {
      // Only allow numbers for price
      if (!isNaN(value) || value === '') {
        updatedItems[index][field] = value;
      }
    } else {
      updatedItems[index][field] = value;
    }
    setMenuItems(updatedItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate form
    if (!categoryName.trim()) {
      setError('Category name is required');
      return;
    }

    // Filter out empty menu items and validate
    const validMenuItems = menuItems.filter(item => 
      item.itemName.trim() && item.itemPrice
    );

    if (validMenuItems.length === 0) {
      setError('At least one menu item is required');
      return;
    }

    // Convert prices to numbers
    const formattedMenuItems = validMenuItems.map(item => ({
      itemName: item.itemName.trim(),
      itemPrice: Number(item.itemPrice)
    }));

    const menuData = {
      categoryName: categoryName.trim(),
      menuItems: formattedMenuItems
    };

    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/menu/createMenus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(menuData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess('Menu created successfully!');
        resetForm();
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setError(result.error || 'Failed to create menu');
      }
    } catch (err) {
      setError('Network error. Please check if the server is running.');
      console.error('Error creating menu:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<Restaurant />}
        onClick={handleOpen}
        sx={{
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          borderRadius: 2,
          fontWeight: 'bold',
          px: 3,
          py: 1
        }}
      >
        Create Menu
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: '#2196F3', 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Restaurant />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Create New Menu
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small" sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                {success}
              </Alert>
            )}

            {/* Category Name */}
            <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
              <TextField
                fullWidth
                label="Category Name"
                variant="outlined"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g., Traditional, Fast Food, Desserts"
                required
                sx={{ mb: 1 }}
              />
              <Typography variant="caption" color="text.secondary">
                Enter the category name for your menu items
              </Typography>
            </Paper>

            {/* Menu Items */}
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', color: '#666' }}>
              Menu Items
            </Typography>

            {menuItems.map((item, index) => (
              <Paper key={index} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      label="Item Name"
                      variant="outlined"
                      value={item.itemName}
                      onChange={(e) => handleMenuItemChange(index, 'itemName', e.target.value)}
                      placeholder="e.g., Chicken Karahi"
                      required
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      label="Item Price"
                      variant="outlined"
                      value={item.itemPrice}
                      onChange={(e) => handleMenuItemChange(index, 'itemPrice', e.target.value)}
                      placeholder="e.g., 1800"
                      type="number"
                      required
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1 }}>Rs.</Typography>
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <IconButton
                        onClick={() => handleRemoveMenuItem(index)}
                        disabled={menuItems.length === 1}
                        sx={{
                          color: menuItems.length === 1 ? '#ccc' : '#f44336',
                          '&:hover': {
                            backgroundColor: menuItems.length === 1 ? 'transparent' : 'rgba(244, 67, 54, 0.1)'
                          }
                        }}
                      >
                        <Remove />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            ))}

            {/* Add More Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                startIcon={<Add />}
                onClick={handleAddMenuItem}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  borderColor: '#4CAF50',
                  color: '#4CAF50',
                  '&:hover': {
                    borderColor: '#388E3C',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)'
                  }
                }}
              >
                Add Menu Item
              </Button>
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={handleClose}
              variant="outlined"
              sx={{ borderRadius: 2 }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                borderRadius: 2,
                fontWeight: 'bold',
                px: 4,
                minWidth: 120
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Create Menu'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default CreateMenuDialog;