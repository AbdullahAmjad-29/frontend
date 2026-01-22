import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Typography,
  Rating,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  LinearProgress,
  Alert,
  CircularProgress,
  Tooltip,
  Divider,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import { Feedback, Close, Star, EmojiEvents, Restaurant, CleanHands, Person, Email } from '@mui/icons-material';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

const API_BASE_URL = 'http://localhost:7001/api';

const ViewFeedbacksDialog = () => {
  const [open, setOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  // Get sentiment icon based on overall experience
  const getSentimentIcon = (experience) => {
    switch (experience) {
      case 'excellent': return <SentimentVerySatisfiedIcon sx={{ color: '#4CAF50' }} />;
      case 'good': return <SentimentSatisfiedIcon sx={{ color: '#8BC34A' }} />;
      case 'okay': return <SentimentNeutralIcon sx={{ color: '#FFC107' }} />;
      case 'bad': return <SentimentDissatisfiedIcon sx={{ color: '#FF9800' }} />;
      case 'very bad': return <SentimentVeryDissatisfiedIcon sx={{ color: '#F44336' }} />;
      default: return <SentimentNeutralIcon sx={{ color: '#9E9E9E' }} />;
    }
  };

  const getSentimentColor = (experience) => {
    switch (experience) {
      case 'excellent': return '#4CAF50';
      case 'good': return '#8BC34A';
      case 'okay': return '#FFC107';
      case 'bad': return '#FF9800';
      case 'very bad': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const fetchFeedbacks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/feedback/getAllFeedback`);
      const result = await response.json();
      
      if (response.ok && result.success) {
        setFeedbacks(result.data || []);
      } else {
        setError(result.error || 'Failed to fetch feedbacks');
      }
    } catch (err) {
      setError('Network error. Please check if the server is running.');
      console.error('Error fetching feedbacks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    fetchFeedbacks();
  };

  const handleClose = () => {
    setOpen(false);
    setFeedbacks([]);
    setError('');
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Calculate average ratings
  const calculateAverages = () => {
    if (feedbacks.length === 0) return { food: 0, service: 0, cleanliness: 0 };
    
    const totals = feedbacks.reduce((acc, feedback) => ({
      food: acc.food + feedback.foodQuality,
      service: acc.service + feedback.service,
      cleanliness: acc.cleanliness + feedback.cleanliness
    }), { food: 0, service: 0, cleanliness: 0 });
    
    return {
      food: (totals.food / feedbacks.length).toFixed(1),
      service: (totals.service / feedbacks.length).toFixed(1),
      cleanliness: (totals.cleanliness / feedbacks.length).toFixed(1)
    };
  };

  const averages = calculateAverages();

  // Filter feedbacks by tab
  const filteredFeedbacks = tabValue === 0 
    ? feedbacks 
    : tabValue === 1 
      ? feedbacks.filter(f => f.overallExperience === 'excellent' || f.overallExperience === 'good')
      : feedbacks.filter(f => f.overallExperience === 'bad' || f.overallExperience === 'very bad');

  return (
    <>
      <Button
        variant="contained"
        startIcon={<Feedback />}
        onClick={handleOpen}
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

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            minHeight: '70vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%)',
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(to right, #FF9800, #FFB74D)', 
          color: 'white',
          py: 3,
          position: 'relative'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <EmojiEvents sx={{ fontSize: 32 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Customer Feedbacks
              </Typography>
              <Chip 
                label={`${feedbacks.length} reviews`} 
                sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 'bold'
                }} 
              />
            </Box>
            <IconButton onClick={handleClose} sx={{ color: 'white' }}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          {/* Stats Summary */}
          {feedbacks.length > 0 && (
            <Paper sx={{ m: 3, p: 3, borderRadius: 3, background: 'white' }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card sx={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: 3,
                    p: 2
                  }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                        <Restaurant sx={{ mr: 1 }} />
                        <Typography variant="h6">Food Quality</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                        <Rating value={parseFloat(averages.food)} readOnly precision={0.1} />
                        <Typography variant="h5" sx={{ ml: 1, fontWeight: 'bold' }}>
                          {averages.food}
                        </Typography>
                      </Box>
                      <Typography variant="body2">Average Rating</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card sx={{ 
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                    borderRadius: 3,
                    p: 2
                  }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                        <Person sx={{ mr: 1 }} />
                        <Typography variant="h6">Service</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                        <Rating value={parseFloat(averages.service)} readOnly precision={0.1} />
                        <Typography variant="h5" sx={{ ml: 1, fontWeight: 'bold' }}>
                          {averages.service}
                        </Typography>
                      </Box>
                      <Typography variant="body2">Average Rating</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card sx={{ 
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    color: 'white',
                    borderRadius: 3,
                    p: 2
                  }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                        <CleanHands sx={{ mr: 1 }} />
                        <Typography variant="h6">Cleanliness</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                        <Rating value={parseFloat(averages.cleanliness)} readOnly precision={0.1} />
                        <Typography variant="h5" sx={{ ml: 1, fontWeight: 'bold' }}>
                          {averages.cleanliness}
                        </Typography>
                      </Box>
                      <Typography variant="body2">Average Rating</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          )}

          {/* Tabs */}
          <Box sx={{ px: 3, pt: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange} centered>
              <Tab label="All Feedbacks" />
              <Tab label="Positive" />
              <Tab label="Needs Improvement" />
            </Tabs>
          </Box>

          {/* Loading State */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10 }}>
              <CircularProgress sx={{ color: '#FF9800' }} />
            </Box>
          )}

          {/* Error State */}
          {error && !loading && (
            <Box sx={{ p: 3 }}>
              <Alert severity="error" sx={{ borderRadius: 3 }}>
                {error}
              </Alert>
            </Box>
          )}

          {/* Empty State */}
          {!loading && !error && feedbacks.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Feedback sx={{ fontSize: 80, color: '#FF9800', mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" sx={{ color: '#666', mb: 1 }}>
                No feedbacks yet
              </Typography>
              <Typography variant="body2" sx={{ color: '#999' }}>
                Be the first to share your experience!
              </Typography>
            </Box>
          )}

          {/* Feedback List */}
          {!loading && !error && feedbacks.length > 0 && (
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {filteredFeedbacks.map((feedbackItem, index) => (
                  <Grid item xs={12} md={6} key={feedbackItem._id || index}>
                    <Card sx={{ 
                      borderRadius: 3,
                      height: '100%',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                      }
                    }}>
                      <CardContent>
                        {/* Header */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ 
                              bgcolor: getSentimentColor(feedbackItem.overallExperience),
                              width: 40,
                              height: 40
                            }}>
                              {feedbackItem.name?.charAt(0).toUpperCase() || 'U'}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                {feedbackItem.name || 'Anonymous'}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#666', display: 'flex', alignItems: 'center' }}>
                                <Email sx={{ fontSize: 12, mr: 0.5 }} />
                                {feedbackItem.email || 'No email provided'}
                              </Typography>
                            </Box>
                          </Box>
                          <Chip
                            icon={getSentimentIcon(feedbackItem.overallExperience)}
                            label={feedbackItem.overallExperience?.toUpperCase()}
                            sx={{
                              backgroundColor: `${getSentimentColor(feedbackItem.overallExperience)}20`,
                              color: getSentimentColor(feedbackItem.overallExperience),
                              fontWeight: 'bold'
                            }}
                          />
                        </Box>

                        {/* Feedback Text */}
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            mb: 3, 
                            color: '#555',
                            fontStyle: feedbackItem.feedback ? 'normal' : 'italic'
                          }}
                        >
                          {feedbackItem.feedback || 'No additional feedback provided.'}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        {/* Ratings */}
                        <Grid container spacing={2}>
                          <Grid item xs={4}>
                            <Tooltip title="Food Quality">
                              <Box sx={{ textAlign: 'center' }}>
                                <Restaurant sx={{ color: '#FF6B6B', mb: 0.5 }} />
                                <Rating 
                                  value={feedbackItem.foodQuality} 
                                  readOnly 
                                  size="small"
                                  sx={{
                                    '& .MuiRating-iconFilled': {
                                      color: '#FF6B6B',
                                    },
                                  }}
                                />
                                <Typography variant="caption" sx={{ color: '#666' }}>
                                  {feedbackItem.foodQuality}/5
                                </Typography>
                              </Box>
                            </Tooltip>
                          </Grid>
                          
                          <Grid item xs={4}>
                            <Tooltip title="Service">
                              <Box sx={{ textAlign: 'center' }}>
                                <Person sx={{ color: '#45B7D1', mb: 0.5 }} />
                                <Rating 
                                  value={feedbackItem.service} 
                                  readOnly 
                                  size="small"
                                  sx={{
                                    '& .MuiRating-iconFilled': {
                                      color: '#45B7D1',
                                    },
                                  }}
                                />
                                <Typography variant="caption" sx={{ color: '#666' }}>
                                  {feedbackItem.service}/5
                                </Typography>
                              </Box>
                            </Tooltip>
                          </Grid>
                          
                          <Grid item xs={4}>
                            <Tooltip title="Cleanliness">
                              <Box sx={{ textAlign: 'center' }}>
                                <CleanHands sx={{ color: '#96CEB4', mb: 0.5 }} />
                                <Rating 
                                  value={feedbackItem.cleanliness} 
                                  readOnly 
                                  size="small"
                                  sx={{
                                    '& .MuiRating-iconFilled': {
                                      color: '#96CEB4',
                                    },
                                  }}
                                />
                                <Typography variant="caption" sx={{ color: '#666' }}>
                                  {feedbackItem.cleanliness}/5
                                </Typography>
                              </Box>
                            </Tooltip>
                          </Grid>
                        </Grid>

                        {/* Date */}
                        <Typography variant="caption" sx={{ color: '#999', display: 'block', mt: 2, textAlign: 'right' }}>
                          {feedbackItem.createdAt ? new Date(feedbackItem.createdAt).toLocaleDateString() : 'Unknown date'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, background: 'rgba(255,255,255,0.8)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Showing {filteredFeedbacks.length} of {feedbacks.length} feedbacks
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                onClick={fetchFeedbacks}
                variant="outlined"
                disabled={loading}
                startIcon={<RefreshIcon />}
                sx={{ borderRadius: 3 }}
              >
                Refresh
              </Button>
              <Button
                onClick={handleClose}
                variant="contained"
                sx={{
                  background: 'linear-gradient(to right, #FF9800, #FFB74D)',
                  borderRadius: 3,
                  fontWeight: 'bold'
                }}
              >
                Close
              </Button>
            </Box>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Add Refresh icon component
const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);

export default ViewFeedbacksDialog;